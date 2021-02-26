async function classifyNew() {
    let elementTextForClassification = document.getElementById("newText");
    let elementClassificationResult = document.getElementById("classificationResult");
    let elementClassificationError = document.getElementById("classificationError");
    let elementPreloader = document.getElementById("preloader");

    elementClassificationResult.textContent = "";
    elementClassificationError.textContent = "";
    elementPreloader.hidden = false;

    let newText = elementTextForClassification.value;

    checkTextResult = checkText(newText);

    if (checkTextResult == "") {
        let jsonForClassification = {
            text: newText
        };

        try {
            let responseClassification = await fetch("/rest-api/classification-new", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(jsonForClassification)
            });

            if (responseClassification.ok) {
                let classificationResult = await responseClassification.json();
                elementPreloader.hidden = true;
                elementClassificationResult.textContent = "Категория: " + classificationResult.category;
            } else {
                elementPreloader.hidden = true;
                elementClassificationError.textContent = "Возникла проблема. Повторите запрос";
            }
        } catch (error) {
            elementPreloader.hidden = true;
            elementClassificationError.textContent = "Ошибка: " + error;
        }
    } else {
        elementPreloader.hidden = true;
        if (checkTextResult == "Empty") {
            elementClassificationError.textContent = "Введен пустой текст для классификации";
        } else {
            if (checkTextResult == "OutOfLimit") {
                elementClassificationError.textContent = "Текст для классификации слишком длинный. Допустимая длина: " + getTextLimit().toString();
            }
        }
    }
}