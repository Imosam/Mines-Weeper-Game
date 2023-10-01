import { makeBoard } from "./MinesWeeper.js"
import { startGame } from "./MinesWeeper.js"
const board = document.querySelector(".game-board")
const mine = document.querySelector("#mine")
const dimension = document.querySelector("#dimension")
const playBtn = document.querySelector("#play")

minesWeeper()
playBtn.addEventListener("click", () => {
  window.location = "/"
})

function resetDefault(board) {
  board.classList.remove("win")
  board.classList.remove("lost")
}
function minesWeeper() {
  if (!mine.value || !dimension.value) return
  if (isNaN(mine.value) || isNaN(dimension.value)) return
  resetDefault(board)
  mine.classList.add("disable-input")
  dimension.classList.add("disable-input")
  board.innerHTML = ""
  const mat = makeBoard(board, Number(mine.value), Number(dimension.value))
  startGame(board, Number(mine.value), Number(dimension.value), mat, mine)
}
