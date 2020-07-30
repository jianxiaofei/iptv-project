((w, doc, arg) => {

    const KEY_BACK = 0x0008, // 返回
      KEY_BACK_640 = 0x0280, // 返回按键（值为640）
      KEY_ENTER = 0x000D, // 确定
      KEY_UP = 0x0026, // 上
      KEY_DOWN = 0x0028, // 下
      KEY_DOWN_83 = 0x0053, // 下
      KEY_0 = 0x0030;  // 0 todo reload test

    let clickTimestamp;
    let focus = 'game-start'; // 焦点保存
    let isRunning = false; // 标记游戏中
    let isModal = false; // 标记弹框
    let guyElement = doc.getElementById('guy');
    let $ = (id) => doc.getElementById(id);

    /**
     * 提示信息对象
     */
    let tips = {

        createTip: (msg, ret) => {
            let tipEl = doc.getElementById('tip');

            if (!tipEl) {
                tipEl = tipEl ? tipEl : doc.createElement('div');
                tipEl.id = 'tip';
                doc.getElementById('container').appendChild(tipEl);
            }

            tipEl.innerHTML = msg;

            setTimeout(() => {
                location.reload();
                // focusAction.back(ret);
            }, 2000);
        },

        show: (msg, ret) => {
            tips.createTip(msg, ret);
        }
    };

    /*
     *游戏跨栏对象
     */
    const Hurdle = {
        /**
         * 开始跨栏（X方向移动）
         * 初始化参数
         */
        startMoveX: () => {

            let that = this;
            let st = 5; // 移动常数st
            let xBg = 0; // 背景移动距离
            let xRoad = 0; // 跑道移动距离
            let xLoop = 0; // 记录距离循环
            let xStop = [-190, -310]; // 结束游戏距离
            let count = 0; // 跨栏个数
            let nSrc = 0; // 图片索引值
            let roadElement = $('game-road');
            let containerElement = $('container');
            let hurdleElement = $('hurdle-count');

            let moveX = {

                /*偏移*/
                offsetX: () => {
                    let num = 2 * st;
                    xBg -= st;
                    xRoad -= num;
                    xLoop -= num;
                    moveX.counter();
                    moveX.animateBg();
                    moveX.animateGuy();
                },

                /*计数器*/
                counter: () => {
                    let index = count === 0 ? 0 : 1;
                    if (xLoop <= xStop[index]) {
                        xLoop = 0;
                        count++;
                    }

                    hurdleElement.innerText = '跨栏个数：' + count + '/10';
                },

                /*背景、跑道动画开始*/
                animateBg: () => {
                    roadElement.style['background-position'] = xRoad + 'px'; // 跑道做移动
                    containerElement.style['background-position'] = xBg + 'px'; // 背景做移动
                },

                /*人物动画开始*/
                animateGuy: () => {
                    if (!that.isJumping) {
                        nSrc === 4 ? nSrc = 1 : nSrc++;
                        guyElement.src = './img/s' + nSrc + '.png'; // 人物动起来
                    }
                },

                /*更新状态*/
                updateX: () => {
                    moveX.isStopGame();
                    moveX.offsetX();
                },

                // 游戏是否结束
                isStopGame: () => {

                    let index = count === 0 ? 0 : 1;
                    let maxCount = count === 10;

                    console.log('xLoop==>' + xLoop);

                    // 在相距栏杆前10px未起跳则失败，10个栏杆已经跳完则停止
                    if (xLoop <= xStop[index] + 10 || maxCount) {
                        let result = 1;
                        let msg = '很遗憾跨栏失败了~，即将返回。';

                        if (!that.isJumping || maxCount) {
                            if (maxCount) {
                                result = 0;
                                msg = '恭喜你成功跨过所有栏杆~, 即将返回。';
                            }
                            clearInterval(moveX.timer);
                            tips.show(msg, result);
                        }
                    }
                }
            };

            isRunning = true;
            $('btn-rule').style.visibility = 'hidden';
            $('game-start').style.visibility = 'hidden';
            moveX.timer = setInterval(moveX.updateX, 60);
        },

        /**
         * 人物起跳动作Y方向移动
         */
        startMoveY: () => {
            let that = this;
            let stayTime = 500;  // 滞空时间

            let moveY = {
                // 起跳
                jump: () => {
                    that.isJumping = true;
                    moveY.update();
                },

                // 更新人物状态
                update: () => {
                    guyElement.src = './img/jump.png'; // 人物跳起来
                    moveY.hover();
                },

                // 滞空
                hover: () => {
                    setTimeout(() => {
                        // 还原状态
                        that.isJumping = false;
                        guyElement.removeAttribute('className');
                    }, stayTime);
                }
            };

            moveY.jump();
        }
    };

    /**
     * 焦点行为对象
     */
    const focusAction = {

        // 起跳
        jump: () => {
            if (Hurdle.isJumping) return;
            Hurdle.startMoveY();
        },

        // 移动
        move: (key, btn) => {
            if (!btn['nextFocus' + key]) return;
            if (key === 'Up' && btn.id === 'game-start') {
                focus = btn.nextFocusUp;
            }
            if (key === 'Down' && btn.id === 'btn-rule') {
                focus = btn.nextFocusDown;
            }
            focusAction.active(btn, buttons[focus]);
        },

        // 点击
        click: (btn) => {

            if (btn.id === 'btn-rule') {
                isModal = true;
                focus = '';
                doc.getElementById('modal-rule').style.display = 'block';
            }

            if (btn.id === 'game-start') {
                Hurdle.startMoveX();
                focus = 'guy';
                isRunning = true;
            }
        },

        // 得到焦点
        active: (prevBtn, currBtn) => {

            let prevFocusEl = doc.getElementById(prevBtn.id);
            let currFocusEl = doc.getElementById(currBtn.id);
            if (prevFocusEl) prevFocusEl.src = prevBtn.bgImg;
            if (currFocusEl) {
                currFocusEl.src = currBtn.FocusBgImg;
            } else {
                alert('按钮不存在！');
            }
        },

        // 返回
        back: (ret) => {
            switch (true) {
                case isModal:
                    doc.getElementById('modal-rule').style.display = 'none';
                    focus = 'btn-rule';
                    isModal = false;
                    break;
                case isRunning: // 游戏中不做什么
                    return false;
                default:
                    location.href = 'backUrl&playResult=' + (ret || 9);
                    break;
            }
        }
    };

    /**
     * 按钮对象
     */
    let buttons = {
        'guy': {
            id: 'guy',
            move: focusAction.jump
        },
        'game-start': {
            id: 'game-start',
            nextFocusUp: 'btn-rule',
            bgImg: './img/btn_start.png',
            FocusBgImg: './img/btn_start_f.png',
            onFocus: focusAction.active,
            click: focusAction.click,
            move: focusAction.move
        },
        'btn-rule': {
            id: 'btn-rule',
            nextFocusDown: 'game-start',
            bgImg: './img/btn_rule.png',
            FocusBgImg: './img/btn_rule_f.png',
            onFocus: focusAction.active,
            click: focusAction.click,
            move: focusAction.move
        }
    };

    /**
     * 事件监听
     */
    let addEventHandler = (ev) => {
        let timeTemp = Math.floor(ev.timeStamp);
        let code = ev.keyCode || ev.which || ev.charCode;
        let currBtn = buttons[focus];

        if (!focus && code !== KEY_BACK) return;

        ev.stopPropagation();
        ev.preventDefault();

        switch (code) {
            case KEY_0:
                location.reload();
                break;
            case KEY_BACK:
            case KEY_BACK_640:
                focusAction.back();
                break;
            case KEY_ENTER:
                if (isRunning) return;
                buttons[focus].click(buttons[focus]);
                break;
            case KEY_UP:
                if (isRunning && timeTemp - clickTimestamp < 500) return; // 禁止长按触发
                currBtn.move('Up', buttons[focus]);
                clickTimestamp = timeTemp;
                break;
            case KEY_DOWN:
            case KEY_DOWN_83:
                currBtn.move('Down', buttons[focus]);
                break;
        }
    };

    focusAction.active('', buttons[focus]);
    doc.onkeydown = addEventHandler;
})(window, document);
