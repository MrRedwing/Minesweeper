const toggle = document.getElementById("darkmode");
const variables = document.querySelector(":root");

toggle.addEventListener("click", () => {
  console.log("hello world");

  let result = getComputedStyle(variables);

  let page = result.getPropertyValue("--page");
  let tile = result.getPropertyValue("--tile");
  let background = result.getPropertyValue("--background");
  let border = result.getPropertyValue("--border");
  let text = result.getPropertyValue("--text");

  variables.style.setProperty("--page", result.getPropertyValue("--page-temp"));
  variables.style.setProperty("--tile", result.getPropertyValue("--tile-temp"));
  variables.style.setProperty(
    "--background",
    result.getPropertyValue("--background-temp")
  );
  variables.style.setProperty(
    "--border",
    result.getPropertyValue("--border-temp")
  );
  variables.style.setProperty("--text", result.getPropertyValue("--text-temp"));

  variables.style.setProperty("--page-temp", page);
  variables.style.setProperty("--tile-temp", tile);
  variables.style.setProperty("--background-temp", background);
  variables.style.setProperty("--border-temp", border);
  variables.style.setProperty("--text-temp", text);
});
