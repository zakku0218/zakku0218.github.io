//レンジ変更
const updateRange = (fieldId) => {
    document.getElementById(fieldId).value = document.getElementById(`${fieldId}-range`).value;
    calculate();
};

//数値変更
const updateNumber = (fieldId) => {
    const numberElement = document.getElementById(fieldId);
    const rangeElement = document.getElementById(`${fieldId}-range`);
    const updateValue = Number(numberElement.value);
    const max = Number(rangeElement.getAttribute('max'));
    if (updateValue > max) {
        rangeElement.value = max;
        numberElement.value = max;
    } else {
        rangeElement.value = updateValue;
    }
    calculate();
};