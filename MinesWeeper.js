export function makeBoard(board, mines, dim) {
  board.classList.remove("hide")
  for (let i = 0; i < dim; i++) {
    for (let j = 0; j < dim; j++) {
      const div = document.createElement("div")
      div.innerHTML = "<span data-nbr='0'></span>"
      div.classList.add("box")
      div.dataset.mine = "false"
      board.appendChild(div)
    }
  }
  board.style = `grid-template-columns:repeat(${dim},1fr);
  grid-template-rows:repeat(${dim},1fr)`
  let mat = [...board.children]
  let i = mines
  while (i--) {
    let divNumber = Math.round(Math.random() * dim * dim)
    do {
      divNumber = Math.round(Math.random() * (dim * dim - 1))
    } while (mat[divNumber].dataset.mine == "true")
    mat[divNumber].dataset.mine = "true"
  }
  mat = makeMatrix(mat, dim)
  determineNumbers(mat, dim)
  setBlankDiv(mat, dim)
  return mat
}
export function startGame(board, mines, dim, mat, mineBox) {
  document.addEventListener("click", (e) => {
    if (!e.target.matches(".box")) return
    const box = e.target
    checkBox(box, board, mines, dim, mat, mineBox)
  })
  /**************************************** */
  document.addEventListener("contextmenu", (e) => {
    e.preventDefault()
    if (!e.target.matches(".box")) return
    const box = e.target
    if (box.dataset.explore == "true") return
    box.classList.toggle("select")
    const result = box.matches(".select")
    if (result) mineBox.value = Number(mineBox.value) - 1
    else mineBox.value = Number(mineBox.value) + 1
  })
}
/********************************* */
function determineNumbers(mat, dim) {
  for (let i = 0; i < dim; i++) {
    for (let j = 0; j < dim; j++) {
      if (mat[i][j].dataset.mine == "true") {
        if (i - 1 >= 0) displayNumber(mat[i - 1][j])
        if (i + 1 < dim) displayNumber(mat[i + 1][j])
        if (j + 1 < dim) {
          displayNumber(mat[i][j + 1])
          if (i + 1 < dim) displayNumber(mat[i + 1][j + 1])
          if (i - 1 >= 0) displayNumber(mat[i - 1][j + 1])
        }
        if (j - 1 >= 0) {
          displayNumber(mat[i][j - 1])
          if (i - 1 >= 0) displayNumber(mat[i - 1][j - 1])
          if (i + 1 < dim) displayNumber(mat[i + 1][j - 1])
        }
      }
    }
  }
}
function displayNumber(div) {
  if (div.dataset.mine == "true") return
  div.dataset.normal = "false"
  const span = div.querySelector("span")
  span.dataset.nbr = Number(span.dataset.nbr) + 1
  span.innerText = span.dataset.nbr
}
function setBlankDiv(mat, dim) {
  for (let i = 0; i < dim; i++) {
    for (let j = 0; j < dim; j++) {
      if (mat[i][j].dataset.mine != "true") mat[i][j].dataset.explore = "false"
    }
  }
}
/************************************ */
/********************************************* */
function explore(blankDiv, mat, dim, l, c) {
  if (blankDiv.dataset.explore == "true") return
  if (isBlank(blankDiv)) {
    blankDiv.classList.add("move")
    blankDiv.dataset.explore = "true"
    if (l - 1 >= 0) explore(mat[l - 1][c], mat, dim, l - 1, c)
    if (l + 1 < dim) explore(mat[l + 1][c], mat, dim, l + 1, c)
    if (c + 1 < dim) {
      explore(mat[l][c + 1], mat, dim, l, c + 1)
      if (l + 1 < dim) explore(mat[l + 1][c + 1], mat, dim, l + 1, c + 1)
      if (l - 1 >= 0) explore(mat[l - 1][c + 1], mat, dim, l - 1, c + 1)
    }
    if (c - 1 >= 0) {
      explore(mat[l][c - 1], mat, dim, l, c - 1)
      if (l + 1 < dim) explore(mat[l + 1][c - 1], mat, dim, l + 1, c - 1)
      if (l - 1 >= 0) explore(mat[l - 1][c - 1], mat, dim, l - 1, c - 1)
    }
  } else {
    const span = blankDiv.querySelector("span")
    span.style.display = "block"
    blankDiv.dataset.normal = "true"
    blankDiv.dataset.explore = "true"
  }
}
function locate(div, mat, dim) {
  for (let i = 0; i < dim; i++) {
    for (let j = 0; j < dim; j++) {
      if (div == mat[i][j]) {
        return [i, j]
      }
    }
  }
}
function countNormalBoxes(mat, dim) {
  let sum = 0
  for (let i = 0; i < dim; i++) {
    for (let j = 0; j < dim; j++) {
      if (!isBlank(mat[i][j]) && mat[i][j].dataset.mine == "false") sum++
    }
  }
  return sum
}
function countCurrentBoxes(...board) {
  board = Array.from(board)
  board = board[0]
  board = Array.from(board)
  let sum = 0
  board.forEach((div) => {
    if (div.dataset.normal == "true") sum++
  })
  return sum
}
function clearSelectedBoxes(...board) {
  board = Array.from(board[0])
  board.forEach((div) => div.classList.remove("select"))
}
function displayMines(mat, dim, mineBox, mines) {
  for (let i = 0; i < dim; i++) {
    for (let j = 0; j < dim; j++) {
      if (mat[i][j].dataset.mine == "true") mat[i][j].classList.add("mine")
    }
  }
  mineBox.value = mines
}
function displayBlankBoxes(...board) {
  board = Array.from(board[0])
  board.forEach((div) => {
    if (isBlank(div)) div.classList.add("move")
  })
}

function checkBox(box, board, mines, dim, mat, mineBox) {
  if (box.matches(".select")) return
  if (box.dataset.mine == "true") {
    clearSelectedBoxes(board.children)
    displayMines(mat, dim, mineBox, mines)
    displayBlankBoxes(board.children)
    board.classList.add("lost")
    mineBox.classList.remove("disable-input")
    dimension.classList.remove("disable-input")
  } else {
    const [l, c] = locate(box, mat, dim)
    explore(box, mat, dim, l, c)
    if (countCurrentBoxes(board.children) == countNormalBoxes(mat, dim)) {
      clearSelectedBoxes(board.children)
      displayMines(mat, dim, mineBox, mines)
      displayBlankBoxes(board.children)
      board.classList.add("win")
      mineBox.classList.remove("disable-input")
      dimension.classList.remove("disable-input")
    }
  }
}
/************************************************ */
function makeMatrix(mat, len) {
  let arr = []
  const newMat = []
  for (let i = 0; i < len; i++) {
    let k = i * len
    while (k < len * (i + 1)) {
      arr.push(mat[k])
      k++
    }
    newMat.push(arr)
    arr = []
  }
  return newMat
}

function isBlank(box) {
  const span = box.querySelector("span")
  if (span.dataset.nbr == "0" && box.dataset.mine == "false") return true
  return false
}
