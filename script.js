const modalContainer = document.querySelector("#modal-container");
const openModalEl = document.querySelector("#open-modal"); // Add Bookmark button
const closeModalEl = document.querySelector("#close-modal"); // Close Modal Icon
const bookmarkForm = document.querySelector("#bookmark-form");
const websiteNameEl = document.querySelector("#website-name");
const websiteUrlEl = document.querySelector("#website-url");
const bookmarkContainer = document.querySelector("#bookmark-container");

// Bookmarks Array to save to Local Storage
let bookmarks = [];

// Show Modal, Focus on Input
function showModal() {
  modalContainer.classList.add("show-modal");
  websiteNameEl.focus();
}

// Modal Event Listeners
openModalEl.addEventListener("click", showModal);
closeModalEl.addEventListener("click", () =>
  modalContainer.classList.remove("show-modal")
);
window.addEventListener("click", (evt) => {
  evt.target === modalContainer
    ? modalContainer.classList.remove("show-modal")
    : false;
});

// Validate input URL
function validateFormInput(websiteName, websiteURL) {
  const expression =
    /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g;
  const regex = new RegExp(expression);

  if (!websiteName || !websiteURL) {
    alert("Please provide input for both fields.");
    return false;
  }

  if (!websiteURL.match(regex)) {
    alert("No match");
    return false;
  }

  return true;
}

// Add Bookmark
function addBookmark(e) {
  e.preventDefault();
  const websiteName = websiteNameEl.value;
  let websiteURL = websiteUrlEl.value;
  if (!websiteURL.includes("https://") && !websiteURL.includes("http://")) {
    websiteURL = `https://${websiteURL}`;
  }
  if (!validateFormInput(websiteName, websiteURL)) {
    return false;
  }
  bookmarks.push({ websiteName, websiteURL });
  localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
  getBookmarks();
  bookmarkForm.reset();
  websiteNameEl.focus();
}

// Event Listeners
bookmarkForm.addEventListener("submit", addBookmark);

// Deleting a Bookmark
function deleteBookmark(websiteURL) {
  bookmarks.forEach((bookmark, i) => {
    if (bookmark.websiteURL === websiteURL) {
      bookmarks.splice(i, 1);
    }
  });
  localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
  buildBookmarks();
}

// Building the Bookmarks
function buildBookmarks() {
  // Remove all bookmarks
  bookmarkContainer.textContent = "";
  bookmarks.forEach((bookmark) => {
    const itemDiv = document.createElement("div");
    const deleteIcon = document.createElement("i");
    const nameDiv = document.createElement("div");
    const image = document.createElement("img");
    const link = document.createElement("a");

    itemDiv.classList.add("item");
    deleteIcon.classList.add("fas", "fa-times");
    nameDiv.classList.add("name");

    deleteIcon.setAttribute("id", "delete-bookmark");
    deleteIcon.setAttribute("title", "Delete Bookmark");
    deleteIcon.setAttribute(
      "onclick",
      `deleteBookmark('${bookmark.websiteURL}')`
    );

    image.setAttribute(
      "src",
      `https://www.google.com/s2/favicons?domain=${bookmark.websiteURL}`
    );
    image.setAttribute("alt", "favicon");

    link.setAttribute("href", bookmark.websiteURL);
    link.setAttribute("target", "_blank");
    link.textContent = bookmark.websiteName;

    nameDiv.append(image, link);
    itemDiv.append(deleteIcon, nameDiv);
    bookmarkContainer.appendChild(itemDiv);
  });
}

function getBookmarks() {
  if (localStorage.getItem("bookmarks")) {
    bookmarks = JSON.parse(localStorage.getItem("bookmarks"));
  } else {
    // Create a 'bookmarks' key on local storage
    bookmarks = [
      {
        websiteName: "Nanyang Zhi Hui",
        websiteURL: "https://nanyang.sch.id",
      },
    ];
    localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
  }
  buildBookmarks();
}

// On Load
getBookmarks();
