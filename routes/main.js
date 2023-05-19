const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth");
const homeController = require("../controllers/home");
const postsController = require("../controllers/posts");
const { ensureAuth, ensureGuest } = require("../middleware/auth");

//Main Routes - simplified for now
router.get("/", homeController.getIndex);
router.get("/profile", ensureAuth, postsController.getProfile);
router.get("/community", ensureAuth, postsController.getFeed);
router.get("/login", authController.getLogin);
router.post("/login", authController.postLogin);
router.get("/logout", authController.logout);
router.get("/signup", authController.getSignup);
router.post("/signup", authController.postSignup);

module.exports = router;


// var addQuest = document.getElementsByClassName("quest");
// var trash = document.getElementsByClassName("fa-trash");

// Array.from(addQuest).forEach(function (element) {
//     element.addEventListener('click', function () {
//         const quest = this.parentNode.parentNode.childNodes[1].innerText
//         fetch('community', {
//             method: 'put',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify({
//                 'addQuest': quest
//             })
//         })
//             .then(response => {
//                 if (response.ok) return response.json()
//             })
//             .then(data => {
//                 console.log(data)
//                 window.location.reload(true)
//             })
//     });
// });

// Array.from(trash).forEach(function (element) {
//     element.addEventListener('click', function () {
//         const name = this.parentNode.parentNode.childNodes[1].innerText
//         const msg = this.parentNode.parentNode.childNodes[3].innerText
//         fetch('messages', {
//             method: 'delete',
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify({
//                 'name': name,
//                 'msg': msg
//             })
//         }).then(function (response) {
//             window.location.reload()
//         })
//     });
// });