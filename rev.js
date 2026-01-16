const button = document.getElementById("btn");
const text = document.getElementById("text");

button.addEventListener("click", () => {
  text.innerText =
    text.innerText === "Hello Accenture" ? "Welcome ASE" : "Hello Accenture";
});
