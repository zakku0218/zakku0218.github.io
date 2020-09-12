//メイン処理
const calculate = () => {
    //入力データ取得
    const ally1Cp = parseInt(document.getElementById("ally1-cp").value);
    const ally2Cp = parseInt(document.getElementById("ally2-cp").value);
    const ally3Cp = parseInt(document.getElementById("ally3-cp").value);
    const supportCp = parseInt(document.getElementById("support-cp").value);
    const bonusPoint = parseInt(document.getElementById("bonus-point").value);
    const replacementCp = parseInt(document.getElementById("replacement-cp").value);
    const replacementCheck = document.getElementById("replacement-radio1").checked;
    let allyCp = ally1Cp + ally2Cp + ally3Cp;
    
    //最終ポイントの計算処理
    const pointArray = calcPoint(allyCp, supportCp, bonusPoint, replacementCp, replacementCheck);
    
    //テーブルのセルへ出力データをセット
    document.getElementById("ally-point").textContent = pointArray['allyPoint'];
    document.getElementById("support-point").textContent = pointArray['supportPoint'];
    document.getElementById("total-point").textContent = pointArray['totalPoint'];
    document.getElementById("rank").textContent = pointArray['rank'];
    document.getElementById("next-rank").textContent = pointArray['nextRank'];
    document.getElementById("minimum-cp").textContent = pointArray['minimumCp'];
    

};

//最終ポイントの計算処理
const calcPoint = (allyCp, supportCp, bonusPoint, replacementCp, replacementCheck) => {

    //最終ポイント計算
    let magnification = BigNumber(1).plus(new BigNumber(bonusPoint).div(100));
    let allyPoint = BigNumber(allyCp).times(1.1).dp(0, BigNumber.ROUND_DOWN);
    let supportPoint = BigNumber(supportCp).times(1.1).dp(0, BigNumber.ROUND_DOWN);
    let totalAllyPoint = BigNumber(allyPoint).times(magnification).dp(0, BigNumber.ROUND_DOWN);
    let totalSupportPoint = BigNumber(supportPoint).times(magnification).dp(0, BigNumber.ROUND_DOWN);
    let totalPoint = BigNumber(totalAllyPoint).plus(totalSupportPoint);

    let rank = "";
    let nextRank = 0;
    if (totalPoint >= 4800000) {
        rank = "SSS+";
    } else if (totalPoint >= 4500000) {
        rank = "SSS";
        nextRank = 4800000 - totalPoint;
    } else if (totalPoint >= 4200000) {
        rank = "SS+";
        nextRank = 4500000 - totalPoint;
    } else if (totalPoint >= 3900000) {
        rank = "SS";
        nextRank = 4200000 - totalPoint;
    } else if (totalPoint >= 3600000) {
        rank = "S+";
        nextRank = 3900000 - totalPoint;
    } else if (totalPoint >= 3000000) {
        rank = "S";
        nextRank = 3600000 - totalPoint;
    } else if (totalPoint >= 2400000) {
        rank = "A+";
        nextRank = 3000000 - totalPoint;
    } else if (totalPoint >= 1800000) {
        rank = "A";
        nextRank = 2400000 - totalPoint;
    } else if (totalPoint >= 1200000) {
        rank = "B";
        nextRank = 1800000 - totalPoint;
    } else if (totalPoint >= 600000) {
        rank = "C";
        nextRank = 1200000 - totalPoint;
    } else {
        rank = "D";
        nextRank = 600000 - totalPoint;
    }

    //入替の計算処理
    let minimumCp = 0;
    let totalCp = allyCp + supportCp;
    let subtraction = BigNumber(totalCp).times(1.1).times(0.04);
    if (replacementCheck == true) {
        //属性ボーナスが4%分少ない場合の最終ポイント計算
        bonusPoint = bonusPoint - 4;
        let tmpMagnification = BigNumber(1).plus(new BigNumber(bonusPoint).div(100));
        minimumCp = BigNumber(replacementCp).plus(new BigNumber(subtraction).div(tmpMagnification).div(1.1).dp(0, BigNumber.ROUND_UP));
    } else {
        //属性ボーナスが4%分多い場合の最終ポイント計算
        bonusPoint = bonusPoint + 4;
        let tmpMagnification = BigNumber(1).plus(new BigNumber(bonusPoint).div(100));
        minimumCp = BigNumber(replacementCp).minus(new BigNumber(subtraction).div(tmpMagnification).div(1.1).dp(0, BigNumber.ROUND_DOWN));
    }

    return {
        allyPoint : Number(allyPoint).toLocaleString(),
        supportPoint : Number(supportPoint).toLocaleString(),
        totalPoint : Number(totalPoint).toLocaleString(),
        rank : rank,
        nextRank : nextRank.toLocaleString(),
        minimumCp : Number(minimumCp).toLocaleString()
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
    $('[data-toggle="tooltip"]').tooltip();

    calculate();
});