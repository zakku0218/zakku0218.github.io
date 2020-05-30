//メイン処理
const calculate = () => {
    //入力データ取得
    const chara1Speed = parseInt(document.getElementById("ally1-speed").value);
    const chara2Speed = parseInt(document.getElementById("ally2-speed").value);
    
    //先手獲得確率の計算処理
    const probArray = calcProbability(chara1Speed, chara2Speed);
    
    //テーブルのセルへ出力データをセット
    document.getElementById("gauge-chara1").textContent = probArray['chara1Gauge'];
    document.getElementById("probability-chara1").textContent = probArray['chara1Prob'];
    document.getElementById("gauge-chara2").textContent = probArray['chara2Gauge'];
    document.getElementById("probability-chara2").textContent = probArray['chara2Prob'];

};

//先手獲得確率の計算処理
const calcProbability = (chara1Speed, chara2Speed) => {

    let chara1FastCount = 0;
    let chara2FastCount = 0;
    let allCount = 0;

    //キャラ1とキャラ2、それぞれの先手獲得回数をカウント
    for (let i = 0; i <= 5; ) {
        let chara1Time = (100 - i) / chara1Speed;
        for (let j = 0; j <= 5; ) {
            let chara2Time = (100 - j) / chara2Speed;
            //キャラ1の方が速い
            if (chara1Time < chara2Time) {
                chara1FastCount++;
                let tmpGauge = chara1Time / chara2Time;
            //キャラ2の方が速い
            } else if (chara1Time > chara2Time) {
                chara2FastCount++;
                let tmpGauge = chara2Time / chara1Time;
            }
            //戦闘開始時アクションゲージ0.2%ずつ計算
            j = BigNumber(j).plus(0.2);
            allCount++;
        }
        //戦闘開始時アクションゲージ0.2%ずつ計算
        i = BigNumber(i).plus(0.2);
    }
    //比較相手の初回行動時アクションゲージ位置
    const chara1MinGauge = Math.floor((95 / chara2Speed) / (100 / chara1Speed) * 100);
    const chara1MaxGauge = Math.floor((100 / chara2Speed) / (95 / chara1Speed) * 100);
    const chara2MinGauge = Math.floor((95 / chara1Speed) / (100 / chara2Speed) * 100);
    const chara2MaxGauge = Math.floor((100 / chara1Speed) / (95 / chara2Speed) * 100);

    //先手獲得確率計算
    return {
        chara1Gauge : chara1MinGauge + "～" + chara1MaxGauge,
        chara1Prob : BigNumber(chara1FastCount / allCount * 100).dp(2, BigNumber.ROUND_DOWN),
        chara2Gauge : chara2MinGauge + "～" + chara2MaxGauge,
        chara2Prob : BigNumber(chara2FastCount / allCount * 100).dp(2, BigNumber.ROUND_DOWN)
    };
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
    calculate();
});