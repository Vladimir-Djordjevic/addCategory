const body = document.body;
function Element(element, id, parent, text = "") {
  this.element = element;
  this.id = id;
  this.parent = parent;
  this.text = text;
}

Element.prototype.createElement = function () {
  const element = document.createElement(this.element);
  element.setAttribute("id", this.id);
  const text = document.createTextNode(this.text);
  element.appendChild(text);
  this.parent.appendChild(element);
  return element;
};

const mainWrapper = new Element("div", "main-wrapper", body);
const mainWrapperElement = mainWrapper.createElement();

const mainTittle = new Element(
  "h1",
  "mainTittle",
  mainWrapperElement,
  "Add Category"
);
const mainTittleElement = mainTittle.createElement();

const formWrapper = new Element("div", "form-wrapper", mainWrapperElement);
const formWrapperElement = formWrapper.createElement();

const form = new Element("form", "formCategory", formWrapperElement);
const formElement = form.createElement();
formElement.method = "POST";

const inputWrapper = new Element("div", "formInput", formElement);
const inputWrapperElement = inputWrapper.createElement();

const input = new Element("input", "category", inputWrapperElement);
const inputElement = input.createElement();
inputElement.type = "text";
inputElement.placeholder = "Category Name";

const buttonWrapper = new Element("div", "buttonWrapper", formElement);
const buttonWrapperElement = buttonWrapper.createElement();

const button = new Element(
  "button",
  "addCategory",
  buttonWrapperElement,
  "Add Category"
);
const buttonElement = button.createElement();
buttonElement.type = "button";

const editButton = new Element(
  "button",
  "edditCategory",
  buttonWrapperElement,
  "Edit Category"
);
const editButtonElement = editButton.createElement();
editButtonElement.type = "button";
editButtonElement.classList.add("display-none");

const table = new Element("table", "table", mainWrapperElement);
const tableElement = table.createElement();

const tableHead = new Element("thead", "thead", tableElement);
tableHeadElement = tableHead.createElement();
const trHead = document.createElement("tr");
tableHeadElement.appendChild(trHead);
const theadList = ["ID", "Category Name", "Delete", "Edit"];

for (thead of theadList) {
  const th = document.createElement("th");
  th.textContent = thead;
  trHead.appendChild(th);
}

const tbody = new Element("tbody", "tableBody", tableElement);
const tbodyElement = tbody.createElement();

function Category(categoryName) {
  this.categoryName = categoryName;
}

buttonElement.addEventListener("click", function () {
  if (inputElement.value !== "") {
    const categoryValue = inputElement.value;
    const categoryInput = new Category(categoryValue);

    fetch("http://localhost:3000/categories", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(categoryInput),
    }).then(function (data) {
      tbody.renderTable();
      console.log("added");
    });
  }
});

Element.prototype.renderTable = function () {
  fetch("http://localhost:3000/categories", {
    method: "GET",
  })
    .then(function (data) {
      return data.json();
    })
    .then(function (categories) {
      tbodyElement.innerHTML = "";
      for (let category of categories) {
        const trBody = document.createElement("tr");
        tbodyElement.appendChild(trBody);
        const categoryId = document.createElement("td");
        categoryId.textContent = category.id;
        const categoryName = document.createElement("td");
        categoryName.innerText = category.categoryName;
        const tdDelete = document.createElement("td");
        const deleteTdLink = document.createElement("a");
        deleteTdLink.href = "#";
        deleteTdLink.textContent = "Delete";
        deleteTdLink.classList.add("delete");
        deleteTdLink.setAttribute("data-id", category.id);

        const tdEdit = document.createElement("td");
        const editTdLink = document.createElement("a");
        editTdLink.classList.add("edit");
        editTdLink.setAttribute("data-id", category.id);
        editTdLink.href = "#";
        editTdLink.textContent = "Edit";
        tdEdit.appendChild(editTdLink);
        tdDelete.appendChild(deleteTdLink);

        trBody.appendChild(categoryId);
        trBody.appendChild(categoryName);
        trBody.appendChild(tdDelete);
        trBody.appendChild(tdEdit);
        inputElement.value = "";
      }

      tbody.delElement();
      tbody.editElement();
    });
};

tbody.renderTable();

Element.prototype.delElement = function () {
  const deleteLinks = document.getElementsByClassName("delete");
  for (let index = 0; index < deleteLinks.length; index++) {
    deleteLinks[index].addEventListener("click", function (event) {
      event.preventDefault();
      console.log("click");
      const id = event.target.getAttribute("data-id");
      console.log(id);
      fetch("http://localhost:3000/categories/" + id, {
        method: "DELETE",
      }).then(function () {
        tbody.renderTable();
      });
    });
  }
};

Element.prototype.editElement = function () {
  const editLinks = document.getElementsByClassName("edit");
  for (let editLink of editLinks) {
    editLink.addEventListener("click", function (event) {
      event.preventDefault();
      console.log("edit");
      const id = event.target.getAttribute("data-id");
      fetch("http://localhost:3000/categories/" + id, {
        method: "GET",
      })
        .then(function (data) {
          return data.json();
        })
        .then(function (category) {
          inputElement.value = category.categoryName;

          buttonElement.classList.add("display-none");
          editButtonElement.classList.remove("display-none");
          editButtonElement.setAttribute("data-id", category.id);

          editButtonElement.addEventListener("click", function (event) {
            const id = event.target.getAttribute("data-id");
            event.preventDefault();
            console.log("Edit Button");
            const categoryValue = inputElement.value;
            const categoryInput = new Category(categoryValue);

            fetch("http://localhost:3000/categories/" + id, {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(categoryInput),
            }).then(function () {
              buttonElement.classList.remove("display-none");
              editButtonElement.classList.add("display-none");
              tbody.renderTable();
            });
          });
        });
    });
  }
};
