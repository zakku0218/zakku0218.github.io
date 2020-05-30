//メイン処理
const calculate = () => {
    try {
        //入力データ取得
        let allyArray = [];
        for (let i = 1; i < 5; i++) {
            if (i == 1 || document.getElementById(`ally${i}-check`).checked) {
                let inputData = {
                    no : i,
                    gauge : document.getElementById(`ally${i}-gauge`).value,
                    speed : document.getElementById(`ally${i}-speed`).value
                };
                allyArray.push(inputData);
            }
        }
        const enemyGauge = document.getElementById(`enemy-gauge`).value;
        const probSpeed = document.getElementById(`prob-speed`).value;
        
        //出力データ取得の為、計算処理
        const outputData = calcOutput(allyArray, enemyGauge, probSpeed);
    
        //テーブルのセルへ出力データをセット
        document.getElementById("min-speed").textContent = outputData['min'];
        document.getElementById("max-speed").textContent = outputData['max'];
        document.getElementById("confirm-speed").textContent = outputData['confirm'];
        document.getElementById("probability-speed").textContent = outputData['probability'];

    } catch (e) {
        $('#output-data').hide();
        $('#error-message').show();
    }
};

//出力データ計算処理
const calcOutput = (allyArray, enemyGauge, probSpeed) => {
    let speedArray = [];
    let speedMin = 80;
    let speedMax = 350;
    //敵の取りうるスピード範囲を絞り込み
    for (let i = 0; i < allyArray.length; i++) {
        for (let j = 0; j <= 5; ) {
            for (let k = 0; k <= 5; ) {
                let speed = allyArray[i]['speed'] / (allyArray[i]['gauge'] - j) * (enemyGauge - k);
                if (j == 0 && k == 5) {
                    speedMin = speedMin < speed ? Math.ceil(speed) : speedMin;
                } else if (j == 5 && k == 0) {
                    speedMax = speedMax > speed ? Math.floor(speed) : speedMax;
                }
                speedArray.push(speed);
                //戦闘開始時アクションゲージ0.2%ずつ計算
                k = BigNumber(k).plus(0.2);
            }
            //戦闘開始時アクションゲージ0.2%ずつ計算
            j = BigNumber(j).plus(0.2);
        }
    }

    //味方データに誤りがあるかチェック
    if (speedMin > speedMax) {
        $('#output-data').hide();
        $('#error-message').show();
    } else {
        $('#output-data').show();
        $('#error-message').hide();
    }

    let countArray = [];
    let rangeCount = 0;
    //各スピードの分布チェック
    for (let i = 0; speedMin + i <= speedMax; i++) {
        let count = 0;
        for (let j = 0; j < speedArray.length; j++) {
            if (speedMin + i == Math.round(speedArray[j])) {
                count = count + 1;
            }
        }
        if (count > 0) {
            let probData = {
                speed : speedMin + i,
                count : count
            };
            countArray.push(probData);
            rangeCount = rangeCount + count;
        }
    }

    let firstProb = 0;
    //先手獲得確率計算
    for (let i = 0; i < countArray.length; i++) {
        let speed = countArray[i]['speed'];
        let prob = countArray[i]['count'] / rangeCount;
        let count = 0;
        let checkCount = 0;
        for (let j = 0; j <= 5; ) {
            for (let k = 0; k <= 5; ) {
                count = (100 - j) / probSpeed < (100 - k) / speed ? count + 1 : count;
                checkCount++;
                //アクションゲージ0.2%ずつ計算
                k = BigNumber(k).plus(0.2);
            }
            //アクションゲージ0.2%ずつ計算
            j = BigNumber(j).plus(0.2);
        }
        firstProb = BigNumber(firstProb).plus(BigNumber(prob * (count / checkCount) * 100));
    }
    //四捨五入の誤差により合計100%にならない事がある為、100%調整を行いたい
    //少数第十位を四捨五入
    firstProb = BigNumber(firstProb).dp(9, BigNumber.ROUND_HALF_UP);
    //画面表示は少数第2位まで
    firstProb = BigNumber(firstProb).dp(2, BigNumber.ROUND_DOWN);

    return {
        min : speedMin,
        max : speedMax,
        confirm : speedMax + Math.floor(speedMax / 19 + 1),
        probability : firstProb
    };
};

//チェックボックス
const changeDisabled = (fieldId) => {
    const checkElement = document.getElementById(`${fieldId}-check`);
    const gaugeNumberElement = document.getElementById(`${fieldId}-gauge`);
    const gaugeRangeElement = document.getElementById(`${fieldId}-gauge-range`);
    const speedNumberElement = document.getElementById(`${fieldId}-speed`);
    const speedRangeElement = document.getElementById(`${fieldId}-speed-range`);
    if (checkElement.checked) {
        gaugeNumberElement.disabled = false;
        gaugeRangeElement.disabled = false;
        speedNumberElement.disabled = false;
        speedRangeElement.disabled = false;
        $(`#${fieldId}-name`).css('border-width', '1px 1px 0px 1px');
    } else {
        gaugeNumberElement.disabled = true;
        gaugeRangeElement.disabled = true;
        speedNumberElement.disabled = true;
        speedRangeElement.disabled = true;
        $(`#${fieldId}-name`).css('border-width', '1px 1px 1px 1px');
    }
    calculate();
};

//押下していない方の折り畳みを閉じる
const changeCollapse = (fieldId) => {
    for (let i = 1; i < 4; i++) {
        if (fieldId != 'memo-' + i) {
            $(`#memo-${i}`).collapse('hide');
        }
    }
};

//ページ読み込み時処理
$(() => {
    //味方2～4の折り畳み状態をチェックボックスの状態に合わせる
    for (let i = 2; i < 5; i++) {
        let checkElement = document.getElementById(`ally${i}-check`);
        if (checkElement.checked) {
            $(`#ally${i}-input`).collapse('show');
            $(`#ally${i}-name`).css('border-bottom', 'none');
        } else {
            $(`#ally${i}-name`).css('border-bottom', '1px solid #DEE2E6');
        }
    }
    $('[data-toggle="tooltip"]').tooltip();

    calculate();
});