console.log("Script block parsing started.");

    console.log("Firebase has been initialized successfully!");


    // ---- Firebase SDK CDN & Config (END) ----

    // ---- Global Variables ----
    let animationInstance = null;
    let quizInstance = null;
    let currentDisplayChar = null;
    let activeInputMode = 'direct';
    let practicedCharSet = new Set();
    let currentPracticeMode = 'normal';
    let numCorrectStrokesInCurrentQuiz = 0;
    let totalStrokesInCurrentChar = 0;
    let currentLevelCharacterArray = [];
    let currentLevelCharIndex = 0;
    let completedLevels = []; 
    let totalPracticedCount = 0; // ✨【新增】練習總次數計數器

    let googleLoginButton, logoutButton, userStatusElem; 
    let userAvatarElem = document.createElement('img');
    userAvatarElem.id = 'user-avatar-display'; 
    userAvatarElem.style.display = 'none'; 

    let replayButtonElem, charSelectionContainerElem, textInputElem, textInputArea, fileInputAreaDiv,
        processDataButtonElem, directInputModeBtnElem, fileInputModeBtnElem, levelSelectModeBtnElem,
        fileInputElem, selectedFileNameDisplayElem, characterSelectSubtitleElem,
        practicedCharsListDivElem, animationWrapperElem, backgroundAudioElem,
        playPauseMusicButtonElem, inputContainerElem, levelSelectionContainerElem,
        levelButtonsAreaElem, quizAreaWrapperElem, normalModePracticeBtn, challengeModePracticeBtn,
        hintNextStrokeButton, practiceModeSelectorElem, rewardDisplayContainerElem;
        
    let allLevelsData = [];
    const masterLevelIndexFile = 'levels/master-level-index.json';


    let currentTrackIndex = 0;
    let isMusicUserInitiated = false;


    // ---- Function Definitions ----


    // ✨ 2. 新增：更新右側成就圖片的函式
    // ✨ 請用此版本完整替換舊的函式
    function updateProgressRewardImage() {
        const imageContainer = document.getElementById('progress-reward-image-container');
        if (!imageContainer) return;

        let selectedReward = progressRewards.default; // 先設定為預設獎勵
        let highestRewardFound = false;

        // 優先檢查「已通關」的獎勵 (從最新完成的關卡開始檢查)
        if (completedLevels.length > 0) {
            for (let i = completedLevels.length - 1; i >= 0; i--) {
                const levelName = completedLevels[i];
                if (progressRewards.byLevel[levelName]) {
                    selectedReward = progressRewards.byLevel[levelName];
                    highestRewardFound = true;
                    break; // 找到最高級的關卡獎勵就停止
                }
            }
        }
        
        // 如果沒有找到任何關卡獎勵，再檢查「練習字數」的獎勵
        if (!highestRewardFound) {
            // ✨【修正】將 starCount 的來源從 practicedCharSet.size 改為 totalPracticedCount
            const starCount = totalPracticedCount;
            
            const starThresholds = Object.keys(progressRewards.byStars).map(Number).sort((a, b) => b - a); // 從高到低排序
            
            for (const threshold of starThresholds) {
                if (starCount >= threshold) {
                    selectedReward = progressRewards.byStars[threshold];
                    break; // 找到符合的最高級門檻就停止
                }
            }
        }

        // 更新畫面上的圖片和文字
        imageContainer.innerHTML = `
            <img src="${selectedReward.src}" alt="${selectedReward.name}">
            <h3>${selectedReward.name}</h3>
            <p>恭喜您達成此成就！</p>
        `;
    }
    // ---- Function Definitions ----

    // ✨ 3B. 新增：生成連結卡片的函式
// ✨ 修改：讓函式能識別換行標記
    function populateLinksPage() {
        const container = document.getElementById('links-container');
        if (!container) return;

        container.innerHTML = ''; // 清空容器

        externalLinksData.forEach(link => {
            // 新增的判斷：如果物件類型是 'break'，就插入換行元素
            if (link.type === 'break') {
                const breakElement = `<div class="grid-row-break"></div>`;
                container.innerHTML += breakElement;
            } else {
                // 否則，像以前一樣建立連結卡片
                const cardHTML = `
                    <a href="${link.url}" target="_blank" rel="noopener noreferrer" class="link-card">
                        <div class="link-card-icon">${link.icon}</div>
                        <div class="link-card-text">
                            <h4>${link.title}</h4>
                            <p>${link.description}</p>
                        </div>
                    </a>
                `;
                container.innerHTML += cardHTML;
            }
        });
    }

    // ✨ 3B. 新增：生成社群連結圖示的函式
    function populateSocialLinks() {
        const container = document.getElementById('social-links-container');
        if (!container) return;

        container.innerHTML = ''; // 清空容器

        socialLinksData.forEach(link => {
            const linkHTML = `
                <a href="${link.url}" target="_blank" rel="noopener noreferrer" class="social-link" title="${link.name}">
                    <img src="${link.icon_src}" alt="${link.name} Icon">
                </a>
            `;
            container.innerHTML += linkHTML;
        });
    }


    // 新增：更新進度頁面(左側)的函式
    function updateProgressPage() {
        const charCountElem = document.getElementById('progress-char-count');
        const levelsListElem = document.getElementById('progress-levels-list');

        if (charCountElem) {
            charCountElem.textContent = totalPracticedCount;
        }

        if (levelsListElem) {
            levelsListElem.innerHTML = ''; // 清空舊列表
            if (completedLevels.length > 0) {
                completedLevels.forEach(levelName => {
                    const levelItem = document.createElement('div');
                    levelItem.classList.add('progress-level-item');
                    levelItem.textContent = levelName;
                    levelsListElem.appendChild(levelItem);
                });
            } else {
                // 如果沒有已通關的關卡，顯示提示文字
                levelsListElem.innerHTML = '<p class="progress-level-placeholder">尚未通過任何關卡</p>';
            }
        }
    }


    function initializeDOMReferences() {
        replayButtonElem = document.getElementById('replay-animation-button');
        charSelectionContainerElem = document.getElementById('character-selection-buttons');
        textInputElem = document.getElementById('text-input');
        textInputArea = document.getElementById('text-input-area');
        fileInputAreaDiv = document.getElementById('file-input-area');
        processDataButtonElem = document.getElementById('process-data-button');
        directInputModeBtnElem = document.getElementById('direct-input-mode-btn');
        fileInputModeBtnElem = document.getElementById('file-input-mode-btn');
        levelSelectModeBtnElem = document.getElementById('level-select-mode-btn');
        fileInputElem = document.getElementById('file-input');
        selectedFileNameDisplayElem = document.getElementById('selected-file-name');
        characterSelectSubtitleElem = document.getElementById('character-select-subtitle');
        practicedCharsListDivElem = document.getElementById('practiced-characters-list');
        animationWrapperElem = document.getElementById('animation-wrapper');
        backgroundAudioElem = document.getElementById('background-audio');
        playPauseMusicButtonElem = document.getElementById('play-pause-music-button');
        normalModePracticeBtn = document.getElementById('normal-mode-practice-btn');
        challengeModePracticeBtn = document.getElementById('challenge-mode-practice-btn');
        hintNextStrokeButton = document.getElementById('hint-next-stroke-button');
        inputContainerElem = document.getElementById('input-container');
        levelSelectionContainerElem = document.getElementById('level-selection-container');
        levelButtonsAreaElem = document.getElementById('level-buttons-area');
        quizAreaWrapperElem = document.getElementById('quiz-area-wrapper');
        practiceModeSelectorElem = document.getElementById('practice-mode-selector');
        rewardDisplayContainerElem = document.getElementById('reward-display-container');
        
        googleLoginButton = document.getElementById('google-login-button');
        logoutButton = document.getElementById('logout-button');
        userStatusElem = document.getElementById('user-status'); 
        userStatusElem.prepend(userAvatarElem); 
        document.getElementById('reset-level-selection-button').onclick = resetLevelSelection;        
    }

    function setupEventListeners() {
        try {
            if (normalModePracticeBtn) normalModePracticeBtn.onclick = () => setPracticeMode('normal');
            if (challengeModePracticeBtn) challengeModePracticeBtn.onclick = () => setPracticeMode('challenge');
            if (processDataButtonElem) processDataButtonElem.onclick = processInputData;
            if (directInputModeBtnElem) directInputModeBtnElem.onclick = () => setActiveInputMode('direct');
            if (fileInputModeBtnElem) fileInputModeBtnElem.onclick = () => setActiveInputMode('file');
            if (levelSelectModeBtnElem) levelSelectModeBtnElem.onclick = () => setActiveInputMode('level');
            if (fileInputElem) fileInputElem.onchange = updateSelectedFileName;
            if (replayButtonElem) replayButtonElem.onclick = replayAnimation;
            if (hintNextStrokeButton) {
                hintNextStrokeButton.onclick = function() {
                    if (quizInstance && (currentPracticeMode === 'challenge' || activeInputMode === 'level_practice')) {
                        if (typeof quizInstance.highlightStroke === 'function' && totalStrokesInCurrentChar > 0) {
                            const nextStrokeToHint = numCorrectStrokesInCurrentQuiz;
                            if (nextStrokeToHint < totalStrokesInCurrentChar) {
                                quizInstance.highlightStroke(nextStrokeToHint, { duration: 1200, color: '#FFD700' });
                            } else {
                                alert("太棒了，所有筆劃均已正確完成！");
                            }
                        } else {
                            alert("無法提供提示功能 (E-H04)。");
                        }
                    }
                };
            }
            setupMusicControls();

            if (googleLoginButton) {
                googleLoginButton.addEventListener('click', async () => {
                    const provider = new firebase.auth.GoogleAuthProvider();
                    try {
                        await auth.signInWithPopup(provider);
                    } catch (error) {
                        console.error("Google 登入失敗:", error.message);
                        userStatusElem.textContent = "登入失敗: " + error.message;
                        userAvatarElem.style.display = 'none';
                    }
                });
            }

            if (logoutButton) {
                logoutButton.addEventListener('click', async () => {
                    try {
                        await auth.signOut();
                    } catch (error) {
                        console.error("登出失敗:", error.message);
                    }
                });
            }

            auth.onAuthStateChanged(async (user) => {
                if (user) {
                    userStatusElem.textContent = `${user.displayName || user.email}`;
                    userAvatarElem.src = user.photoURL || '';
                    userAvatarElem.alt = user.displayName || 'User Avatar';
                    userAvatarElem.style.display = 'inline-block';

                    googleLoginButton.style.display = 'none';
                    logoutButton.style.display = 'block';

                    const userDocRef = db.collection('users').doc(user.uid);
                    try {
                        const doc = await userDocRef.get();
                        if (doc.exists) {
                            const userData = doc.data();
                            completedLevels = userData.completedLevels || [];
                            practicedCharSet = new Set(userData.practicedChars || []);
                            totalPracticedCount = userData.totalPracticedCount || 0; 
                            console.log("用戶數據已載入:", userData);
                        } else {
                            await userDocRef.set({
                                completedLevels: [],
                                practicedChars: [],
                                totalPracticedCount: 0,
                                lastLogin: firebase.firestore.FieldValue.serverTimestamp()
                            });
                            completedLevels = [];
                            practicedCharSet = new Set();
                            console.log("新用戶數據已建立。");
                        }
                    } catch (error) {
                        console.error("載入或初始化用戶數據失敗:", error);
                        completedLevels = [];
                        practicedCharSet = new Set();
                    } finally {
                        updatePracticedCharactersDisplay();
                        //populateLevelSelectionUI();//
                        updateProgressPage(); // ✨ 更新進度頁面
                        updateProgressRewardImage(); 
                    }

                } else {
                    userStatusElem.textContent = '請登入以保存你的進度。';
                    userAvatarElem.style.display = 'none';

                    googleLoginButton.style.display = 'block';
                    logoutButton.style.display = 'none';

                    completedLevels = [];
                    practicedCharSet = new Set();
                    totalPracticedCount = 0; 
                    updatePracticedCharactersDisplay();
                    //populateLevelSelectionUI();//
                    updateProgressPage(); // ✨ 更新進度頁面
                    updateProgressRewardImage(); 

                    localStorage.removeItem('completedLevels');
                    localStorage.removeItem('practicedCharSet');
                }
            });

        } catch (error) {
            console.error("Error during setupEventListeners:", error);
        }
    }

    function initializeAppState() {
            try {
                directInputModeBtnElem.textContent = '輸入你想練的字';
                fileInputModeBtnElem.textContent = '匯入檔案';
                levelSelectModeBtnElem.textContent = '挑戰小學關卡';
                processDataButtonElem.textContent = '處理資料';
                replayButtonElem.textContent = '來看看筆順吧';
                normalModePracticeBtn.textContent = '一般臨摹';
                challengeModePracticeBtn.textContent = '挑戰模式';
                hintNextStrokeButton.textContent = '提示下一筆';

                setupMusicControls();
                setActiveInputMode('direct');
                setPracticeMode('normal');

                loadLevelData();
                if(animationWrapperElem) {
                    animationWrapperElem.style.display = 'none';
                }
            } catch (error) {
                console.error("Error during initializeAppState:", error);
            }
        }

// 新增：用於儲存關卡選擇狀態的變數
    let masterLevelData = null;
    let selectedVersion = null;
    let selectedGrade = null;

    // 修改後的 loadLevelData 函式
    async function loadLevelData() {
        try {
            // 現在只會載入主索引檔案
            const response = await fetch(masterLevelIndexFile);
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            masterLevelData = await response.json();
            // 載入成功後，生成第一層UI (版本選擇)
            populateVersionUI(); 
        } catch (error) {
            alert("載入關卡主索引檔案失敗，請檢查檔案路徑或內容。");
            console.error("Error loading master level index:", error);
        }
    }

    // 新增：生成「版本」選項的函式
    function populateVersionUI() {
        const container = document.querySelector('#version-selection-area .level-buttons-wrapper');
        container.innerHTML = '';
        if (!masterLevelData) return;

        Object.keys(masterLevelData).forEach(versionName => {
            const button = createTierButton(versionName, () => {
                selectedVersion = versionName;
                // 更新按鈕選中狀態
                document.querySelectorAll('#version-selection-area .tier-button').forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                
                // 顯示下一層並隱藏更後面的層級
                document.getElementById('grade-selection-area').style.display = 'block';
                document.getElementById('lesson-selection-area').style.display = 'none';
                document.getElementById('reset-level-selection-button').style.display = 'inline-block';
                populateGradeUI(); // 生成年級選項
            });
            container.appendChild(button);
        });
    }

    // 新增：生成「年級」選項的函式
    function populateGradeUI() {
        const container = document.querySelector('#grade-selection-area .level-buttons-wrapper');
        container.innerHTML = '';
        const grades = masterLevelData[selectedVersion];

        Object.keys(grades).forEach(gradeName => {
            const button = createTierButton(gradeName, () => {
                selectedGrade = gradeName;
                document.querySelectorAll('#grade-selection-area .tier-button').forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');

                document.getElementById('lesson-selection-area').style.display = 'block';
                populateLessonUI(); // 生成課次選項
            });
            container.appendChild(button);
        });
    }

    // 新增：生成「課次」選項的函式
    function populateLessonUI() {
        const container = document.querySelector('#lesson-selection-area .level-buttons-wrapper');
        container.innerHTML = '';
        const lessons = masterLevelData[selectedVersion][selectedGrade];

        Object.keys(lessons).forEach(lessonName => {
            const button = createTierButton(lessonName, async () => {
                const lessonFilePath = lessons[lessonName];
                try {
                    // 直到最後一步才真正去載入課次的JSON檔案
                    const response = await fetch(lessonFilePath);
                    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
                    const lessonData = await response.json();
                    currentActiveLevelData = { 
                        levelName: `${selectedVersion} - ${selectedGrade} - ${lessonName}` 
                    };                    
                    // 成功取得課次資料，開始練習
                    setActiveInputMode('level_practice');
                    currentLevelCharacterArray = lessonData.characters;
                    currentLevelCharIndex = 0;
                    if (currentLevelCharacterArray.length > 0) {
                        startLevelCharacterPractice(currentLevelCharacterArray[0]);
                    } else {
                        alert(`課次 "${lessonName}" 中沒有字元。`);
                        resetLevelSelection();
                    }

                } catch (error) {
                    alert(`載入課次檔案 "${lessonName}" 失敗。`);
                    console.error("Error loading lesson file:", error);
                }
            });
            container.appendChild(button);
        });
    }

    // 新增：建立選項按鈕的輔助函式
    function createTierButton(text, onClick) {
        const button = document.createElement('button');
        button.classList.add('tier-button');
        button.textContent = text;
        button.onclick = onClick;
        return button;
    }

    // 新增：重置所有關卡選擇的輔助函式
    function resetLevelSelection() {
        selectedVersion = null;
        selectedGrade = null;
        document.getElementById('version-selection-area').querySelectorAll('.tier-button').forEach(btn => btn.classList.remove('active'));
        document.getElementById('grade-selection-area').style.display = 'none';
        document.getElementById('lesson-selection-area').style.display = 'none';
        document.getElementById('reset-level-selection-button').style.display = 'none';
    }
    function startLevelCharacterPractice(char) {
        if (!char) {
            handleLevelCompletion(currentActiveLevelData); 
            return;
        }
        currentDisplayChar = char;
        if (animationWrapperElem) animationWrapperElem.style.display = 'flex';
        
        const animBoxElement = document.getElementById('animation-display');
        if (animBoxElement) {
            // ✨【修改 START】
            // 1. 取得 SVG 格線範本的 HTML 內容
            const gridTemplate = document.getElementById('hanzi-grid-template').outerHTML;

            // 2. 將動畫框的內容設定為我們的格線
            animBoxElement.innerHTML = gridTemplate.replace('id="hanzi-grid-template"', 'id="animation-grid-svg"');
            // ✨【修改 END】
            
            // ✨【修改】將 HanziWriter 的目標從 div 改為 SVG 的 ID
            animationInstance = HanziWriter.create('animation-grid-svg', char, {
                padding: 10,
                strokeColor: '#000000', 
                showCharacter: true, 
                showOutline: false
            });

            if (replayButtonElem) replayButtonElem.disabled = false;
            animationInstance.animateCharacter();
        }
        createQuizInstance(char);
    }
    function setActiveInputMode(mode) {
        activeInputMode = mode;

        if (animationWrapperElem) animationWrapperElem.style.display = 'none';

        const quizBox = document.getElementById('quiz-display');
        if (quizBox) {
            const svg = quizBox.querySelector('svg:not(#congrats-overlay svg)');
            if (svg) svg.remove();
        }

        hideAllRewards();

        const charContainer = document.getElementById('character-selection-buttons-container');
        if (charContainer) charContainer.style.display = 'none';
        if (charSelectionContainerElem) charSelectionContainerElem.innerHTML = '';

        // ✨【修正】增加 typeof 檢查，確保 cleanup 是個函式才呼叫
        if (quizInstance && typeof quizInstance.cleanup === 'function') {
            quizInstance.cleanup();
        }
        if (animationInstance && typeof animationInstance.cleanup === 'function') {
            animationInstance.cleanup();
        }
        quizInstance = null;
        animationInstance = null;
        currentDisplayChar = null;

        if (!directInputModeBtnElem || !inputContainerElem || !levelSelectionContainerElem) return;

        directInputModeBtnElem.classList.toggle('active', mode === 'direct');
        fileInputModeBtnElem.classList.toggle('active', mode === 'file');
        levelSelectModeBtnElem.classList.toggle('active', mode === 'level' || mode === 'level_practice');

        inputContainerElem.style.display = (mode === 'direct' || mode === 'file') ? 'flex' : 'none';
        levelSelectionContainerElem.style.display = (mode === 'level') ? 'flex' : 'none';

        const isCustomMode = (mode === 'direct' || mode === 'file');
        const isLevelMode = (mode === 'level' || mode === 'level_practice');

        if(practiceModeSelectorElem) {
            practiceModeSelectorElem.style.display = isLevelMode ? 'none' : 'flex';
        }

        if (isCustomMode) {
            if (characterSelectSubtitleElem) characterSelectSubtitleElem.style.display = 'none';
            if (mode === 'direct') showDirectInputModeInternal(); else showFileUploadModeInternal();
        }
        if (mode === 'level') {
            resetLevelSelection(); 
        }
    }

    function showDirectInputModeInternal() {
        if(textInputArea) textInputArea.style.display = 'flex';
        if(fileInputAreaDiv) fileInputAreaDiv.style.display = 'none';
    }
    function showFileUploadModeInternal() {
        if(textInputArea) textInputArea.style.display = 'none';
        if(fileInputAreaDiv) fileInputAreaDiv.style.display = 'flex';
    }

    function updateSelectedFileName() {
        if (fileInputElem?.files.length > 0) { if (selectedFileNameDisplayElem) selectedFileNameDisplayElem.textContent = `已選檔案: ${fileInputElem.files[0].name}`; }
        else { if (selectedFileNameDisplayElem) selectedFileNameDisplayElem.textContent = ''; }
    }

    function processInputData() {
      try {
        const charContainer = document.getElementById('character-selection-buttons-container');
        if (charContainer) {
            charContainer.style.display = 'none';
        }

        if(charSelectionContainerElem) charSelectionContainerElem.innerHTML = '';
        
        // ✨【修正】增加 typeof 檢查
        if (animationInstance && typeof animationInstance.cleanup === 'function') {
            animationInstance.cleanup();
        }
        if (quizInstance && typeof quizInstance.cleanup === 'function') {
            quizInstance.cleanup();
        }
        animationInstance = null; 
        quizInstance = null; 
        currentDisplayChar = null;
        
        if(replayButtonElem) replayButtonElem.disabled = true;
        if (animationWrapperElem) animationWrapperElem.style.display = 'none';

        const quizBox = document.getElementById('quiz-display');
        if (quizBox) {
            const svg = quizBox.querySelector('svg:not(#congrats-overlay svg)');
            if (svg) svg.remove();
        }

        if (characterSelectSubtitleElem) characterSelectSubtitleElem.style.display = 'none';
        if (hintNextStrokeButton) hintNextStrokeButton.style.display = 'none';
        numCorrectStrokesInCurrentQuiz = 0; totalStrokesInCurrentChar = 0;
        if (activeInputMode === 'direct') {
            if (!textInputElem) { alert("錯誤：找不到文字輸入框元件！"); return; }
            const text = textInputElem.value.trim();
            if (text.length > 0) generateCharacterButtons(text); else alert("請輸入文字！");
        } else if (activeInputMode === 'file') {
            if (!fileInputElem || !fileInputElem.files || fileInputElem.files.length === 0) { alert("請選擇一個檔案！"); return; }
            const file = fileInputElem.files[0];
            if (file) {
              const reader = new FileReader();
              reader.onload = function(e) { generateCharacterButtons(e.target.result); };
              reader.onerror = function() { alert("讀取檔案時發生錯誤。"); };
              reader.readAsText(file, 'UTF-8');
            }
        }
      } catch (error) { console.error("Error in processInputData:", error); }
    }

    function generateCharacterButtons(text) {
      try {
        const uniqueChars = [...new Set(text.replace(/[^\u4e00-\u9fa5]/g, ''))];
        if(charSelectionContainerElem) charSelectionContainerElem.innerHTML = '';
        if (uniqueChars.length > 0) {
            const charContainer = document.getElementById('character-selection-buttons-container');
            if (charContainer) {
                charContainer.style.display = 'block';
            }

            if (characterSelectSubtitleElem) characterSelectSubtitleElem.style.display = 'block';
            if (charSelectionContainerElem) charSelectionContainerElem.style.display = 'flex';
            uniqueChars.forEach(char => {
            const button = document.createElement('button');
            button.classList.add('char-select-button');
            button.textContent = char;
            button.onclick = function() {
                document.querySelectorAll('.char-select-button.active').forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                displayCharacterInBothModes(char);
            };
            if(charSelectionContainerElem) charSelectionContainerElem.appendChild(button);
            });
        } else {
            alert("未在輸入中找到有效的中文字元進行練習！");
        }
      } catch (error) { console.error("Error in generateCharacterButtons:", error); }
    }

    function setPracticeMode(mode) {
        currentPracticeMode = mode;
        if (!normalModePracticeBtn || !challengeModePracticeBtn || !hintNextStrokeButton) return;
        normalModePracticeBtn.classList.toggle('active', mode === 'normal');
        challengeModePracticeBtn.classList.toggle('active', mode === 'challenge');
        let showHint = (mode === 'challenge' && quizInstance && currentDisplayChar);
        if (activeInputMode === 'level_practice') { showHint = false; }
        hintNextStrokeButton.style.display = showHint ? 'inline-block' : 'none';
        if (currentDisplayChar && quizInstance) { createQuizInstance(currentDisplayChar); }
    }

    function createQuizInstance(char) {
        const quizBox = document.getElementById('quiz-display');
        if (!quizBox) return;

        // ✨【修改 START】
        // 1. 取得 SVG 格線範本的 HTML 內容
        const gridTemplate = document.getElementById('hanzi-grid-template').outerHTML;
        
        // 2. 將臨摹框的內容設定為我們的格線。我們給這個格線一個新的、獨立的 ID。
        quizBox.innerHTML = gridTemplate.replace('id="hanzi-grid-template"', 'id="quiz-grid-svg"');
        // ✨【修改 END】

        const options = {
            padding: 20,
            strokeColor: '#000000', 
            drawingColor: '#333333',
            highlightOnComplete: true,
            onLoadCharDataSuccess: function(charDataObj) {
                if (quizInstance?.quiz) {
                    quizInstance.quiz({
                        onCorrectStroke: () => {},
                        onComplete: () => {
                            totalPracticedCount++;
                            practicedCharSet.add(char);
                            updatePracticedCharactersDisplay();
                            updateProgressPage();
                            updateProgressRewardImage();
                            saveUserDataToFirebase({ 
                                practicedChars: Array.from(practicedCharSet),
                                totalPracticedCount: totalPracticedCount
                            });
                            if (activeInputMode === 'level_practice') {
                                currentLevelCharIndex++;
                                setTimeout(() => startLevelCharacterPractice(currentLevelCharacterArray[currentLevelCharIndex]), 500);
                            }
                        }
                    });
                }
            }
        };

        if (currentPracticeMode === 'challenge' || activeInputMode === 'level_practice') {
            options.showOutline = false;
        } else {
            options.showOutline = true;
            options.outlineColor = '#DDDDDD';
        }
        
        // ✨【修改】將 HanziWriter 的目標從 div 改為我們剛剛建立的 SVG 的 ID
        quizInstance = HanziWriter.create('quiz-grid-svg', char, options);
    }

    function displayCharacterInBothModes(char) {
      try {
        currentDisplayChar = char;
        if (animationWrapperElem) animationWrapperElem.style.display = 'flex';
        if (practiceModeSelectorElem) practiceModeSelectorElem.style.display = 'flex';
        
        const animBoxElement = document.getElementById('animation-display');
        const quizBoxElement = document.getElementById('quiz-display');

        if(animBoxElement) animBoxElement.innerHTML = '';
        if(quizBoxElement){
            const hanziWriterSVG = quizBoxElement.querySelector('svg:not(#congrats-overlay svg)');
            if (hanziWriterSVG) hanziWriterSVG.remove();
        }

        // ✨【修正】增加 typeof 檢查
        if (animationInstance && typeof animationInstance.cleanup === 'function') {
            animationInstance.cleanup();
        }
        if (quizInstance && typeof quizInstance.cleanup === 'function') {
            quizInstance.cleanup();
        }
        animationInstance = null; 
        quizInstance = null;

        numCorrectStrokesInCurrentQuiz = 0; 
        totalStrokesInCurrentChar = 0;
        if(replayButtonElem) replayButtonElem.disabled = true;
        if (hintNextStrokeButton) { hintNextStrokeButton.style.display = 'none'; hintNextStrokeButton.disabled = true; }

        if (animBoxElement) {
            const gridTemplate = document.getElementById('hanzi-grid-template').outerHTML;
            animBoxElement.innerHTML = gridTemplate.replace('id="hanzi-grid-template"', 'id="animation-grid-svg"');
            
            animationInstance = HanziWriter.create('animation-grid-svg', char, {
                strokeColor: '#000000', 
                showCharacter: true, 
                showOutline: false,
                strokeAnimationSpeed: 0.6, 
                delayBetweenStrokes: 80, 
                autoAnimate: false,
                onLoadCharDataSuccess: function() { 
                    if (animationInstance) { 
                        animationInstance.animateCharacter(); 
                        if(replayButtonElem) replayButtonElem.disabled = false;
                    }
                },
            });

            if (!animationInstance && replayButtonElem) { replayButtonElem.disabled = true; }
        }
        createQuizInstance(char);
      } catch (error) { console.error("Error in displayCharacterInBothModes for " + char + ":", error); }
    }

    function replayAnimation() { if (animationInstance) { animationInstance.animateCharacter();}}
    function updatePracticedCharactersDisplay() {
        if (!practicedCharsListDivElem) return;
        practicedCharsListDivElem.innerHTML = '';
        if (practicedCharSet.size === 0) { practicedCharsListDivElem.textContent = '尚未練習任何字元。'; return;}
        const charsArray = Array.from(practicedCharSet);
        charsArray.forEach(practicedChar => {
            const charSpan = document.createElement('span');
            charSpan.classList.add('practiced-char-item');
            charSpan.textContent = practicedChar;
            practicedCharsListDivElem.appendChild(charSpan);});
    }
// ✨ 2. 全新的「獎勵搜尋」函式
    function findRewardForLevel(levelName) {
        if (!levelName) return null;

        // 將 "康軒 - 一年級 - 第一課" 這樣的名稱拆解成三個部分
        const parts = levelName.split(' - ');
        if (parts.length < 3) return null;
        
        const currentVersion = parts[0];
        const currentGrade = parts[1];
        const currentLesson = parts[2];

        // 遍歷所有獎勵規則
        for (const rule of levelRewards) {
            const cond = rule.conditions;
            // 檢查版本、年級、課次是否都符合規則
            const versionMatch = cond.version === currentVersion;
            const gradeMatch = cond.grade === currentGrade;
            const lessonMatch = cond.lessons.includes(currentLesson);

            if (versionMatch && gradeMatch && lessonMatch) {
                return rule.rewards; // 找到符合的規則，返回其獎勵陣列
            }
        }

        return null; // 如果沒有任何規則符合，返回 null
    }
// ✨ 3. 修改通關動畫函式以支援隨機播放
    function playLevelCompletionAnimation(levelData) {
        const overlay = document.getElementById('congrats-overlay');
        if (!overlay || !levelData || !levelData.levelName) return;

        // 使用新的搜尋函式來尋找符合條件的獎勵池 (一個陣列)
        const rewardPool = findRewardForLevel(levelData.levelName);

        // 檢查是否找到了獎勵池，且池中有獎勵
        if (!rewardPool || rewardPool.length === 0) {
            console.log(`沒有為關卡 "${levelData.levelName}" 設定任何獎勵。`);
            // 即使沒有影片，也顯示恭喜訊息並正常返回
            overlay.innerHTML = `<h2>恭喜！您已完成 ${levelData.levelName}！</h2>`;
            overlay.style.display = 'flex';
            setTimeout(() => {
                overlay.style.opacity = '0';
                setTimeout(() => {
                    overlay.style.display = 'none';
                    setActiveInputMode('level');
                }, 500);
            }, 3000);
            return; // 提前結束函式
        }

        // 從獎勵池中隨機挑選一個獎勵
        const selectedReward = rewardPool[Math.floor(Math.random() * rewardPool.length)];

        // --- 後續的顯示邏輯與之前類似 ---
        const DESIRED_PLAY_COUNT = 1; // 預設播放一次，您可以調整
        let content = `<h2>恭喜！您已完成 ${levelData.levelName}！</h2>`;

        if (selectedReward && selectedReward.src) {
            if (selectedReward.type === 'video') {
                content += `<video src="${selectedReward.src}" autoplay muted playsinline class="congrats-image"></video>`;
            } else {
                content += `<img src="${selectedReward.src}" alt="完成獎勵" class="congrats-image">`;
            }
        }

        overlay.innerHTML = content;
        
        const videoElement = overlay.querySelector('video');
        if (videoElement) {
            let playCount = 0; 
            videoElement.addEventListener('ended', () => {
                playCount++;
                if (playCount < DESIRED_PLAY_COUNT) {
                    videoElement.play();
                } else {
                    fadeOutAndHide();
                }
            });
        } else {
             // 如果是圖片，則固定時間後消失
             setTimeout(fadeOutAndHide, 4000);
        }

        function fadeOutAndHide() {
            overlay.style.opacity = '0';
            setTimeout(() => {
                overlay.style.display = 'none';
                setActiveInputMode('level');
            }, 500);
        }

        overlay.style.display = 'flex';
        setTimeout(() => {
            overlay.style.opacity = '1';
        }, 10);
    }

    function handleLevelCompletion(levelData) {
        if (!levelData || !levelData.levelName) return;
        if (!completedLevels.includes(levelData.levelName)) {
            completedLevels.push(levelData.levelName);
            saveUserDataToFirebase({ completedLevels: completedLevels });
            updateProgressPage(); 
            updateProgressRewardImage();
        }
        playLevelCompletionAnimation(levelData);
    }

    async function saveUserDataToFirebase(dataToSave) {
        if (auth.currentUser) {
            const userDocRef = db.collection('users').doc(auth.currentUser.uid);
            try {
                await userDocRef.set(dataToSave, { merge: true });
                console.log("用戶數據已保存到 Firebase:", dataToSave);
            } catch (error) {
                console.error("保存用戶數據到 Firebase 失敗:", error);
            }
        } else {
            console.warn("用戶未登入，數據無法保存到 Firebase。");
        }
    }

    function showReward(rewardIdentifier, rewardType) {
        if (!rewardDisplayContainerElem) return;
        let reward = levelRewards[rewardIdentifier];

        if (!reward) { rewardDisplayContainerElem.style.display = 'none'; return; }

        rewardDisplayContainerElem.innerHTML = '';
        rewardDisplayContainerElem.style.width = reward.size || '150px';
        if (reward.type === 'image') {
            const img = document.createElement('img');
            img.src = reward.src;
            img.alt = `完成獎勵`;
            img.onerror = () => { rewardDisplayContainerElem.innerHTML = '<p style="color:red;font-size:12px;">獎勵圖片載入失敗</p>'; };
            rewardDisplayContainerElem.appendChild(img);
        }
        rewardDisplayContainerElem.style.display = 'block';

        rewardDisplayContainerElem.style.transform = 'translateY(100%) translateX(100%)';
        rewardDisplayContainerElem.style.opacity = '0';
        setTimeout(() => {
            rewardDisplayContainerElem.style.transition = 'transform 0.5s ease-out, opacity 0.5s ease-out';
            rewardDisplayContainerElem.style.transform = 'translateY(-10px) translateX(-10px)';
            rewardDisplayContainerElem.style.opacity = '1';
        }, 50);

        setTimeout(() => {
            rewardDisplayContainerElem.style.transition = 'transform 0.3s ease-in, opacity 0.3s ease-in';
            rewardDisplayContainerElem.style.transform = 'translateY(-50px) translateX(-10px)';
            rewardDisplayContainerElem.style.opacity = '0';
        }, 1000);

        setTimeout(() => {
            rewardDisplayContainerElem.style.display = 'none';
            rewardDisplayContainerElem.style.transform = 'translateY(100%) translateX(100%)';
        }, 1300);
    }

    function hideAllRewards() {
        if (rewardDisplayContainerElem) { rewardDisplayContainerElem.style.display = 'none'; }
    }

    function setupMusicControls() {
        if (!playPauseMusicButtonElem || !backgroundAudioElem) { console.error("Music elements not found."); return; }
        playPauseMusicButtonElem.onclick = function() { if (!isMusicUserInitiated || backgroundAudioElem.paused) { playCurrentTrack(); } else { backgroundAudioElem.pause(); playPauseMusicButtonElem.textContent = '開啟背景音樂'; }};
        backgroundAudioElem.onended = function() { currentTrackIndex = (currentTrackIndex + 1) % musicPlaylist.length; loadTrack(currentTrackIndex, true); };
        backgroundAudioElem.onerror = function(e) { playPauseMusicButtonElem.textContent = '播放錯誤'; playPauseMusicButtonElem.disabled = true; console.error("Audio error:", e);};
        if (musicPlaylist.length === 0) { playPauseMusicButtonElem.textContent = '無音樂'; playPauseMusicButtonElem.disabled = true; }
        else { playPauseMusicButtonElem.textContent = '開啟背景音樂'; playPauseMusicButtonElem.disabled = false; loadTrack(0, false); }
    }

    function loadTrack(trackIndex, playWhenLoaded = false) {
        if (!backgroundAudioElem || !playPauseMusicButtonElem ) { return; }
        currentTrackIndex = (trackIndex < 0 || trackIndex >= musicPlaylist.length) ? 0 : trackIndex;
        if (musicPlaylist.length === 0) { playPauseMusicButtonElem.textContent = '無音樂'; playPauseMusicButtonElem.disabled = true; return; }
        const track = musicPlaylist[currentTrackIndex];
        if (!track || !track.path) { playPauseMusicButtonElem.textContent = '音軌錯誤'; playPauseMusicButtonElem.disabled = true; return; }
        backgroundAudioElem.src = track.path; backgroundAudioElem.load();
        if (playWhenLoaded) playCurrentTrack(); else { playPauseMusicButtonElem.textContent = '開啟背景音樂'; playPauseMusicButtonElem.disabled = false; }
    }

    function playCurrentTrack() {
        if (!backgroundAudioElem || !playPauseMusicButtonElem) { return; }
        if (musicPlaylist.length === 0) { return; }
        const playPromise = backgroundAudioElem.play();
        if (playPromise !== undefined) {
            playPromise.then(() => { playPauseMusicButtonElem.textContent = '關閉背景音樂'; isMusicUserInitiated = true; })
                       .catch(error => { console.warn("Audio play failed:", error); playPauseMusicButtonElem.textContent = '開啟背景音樂'; });
        }
    }

    // --- Window Onload: The main entry point ---
    window.onload = function() {
        console.log("window.onload executed.");
        initializeDOMReferences();
        setupEventListeners();
        initializeAppState();
        populateLinksPage(); 
        populateSocialLinks();
    };