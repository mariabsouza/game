function init() {

  const grid = document.querySelector('#grid')

  const scoreKeeper = document.querySelector('#score')


  // Grid size
  const width = 9
  const height = 7
  const cells = width * height

  // other variables
  const colors = ['green', 'purple', 'orange', 'blue']
  let inPlay = []
  let emptyCells = []
  let proximity = false
  let colorCheck = false
  let score = 0

  let firstMove = false

  function checkProximity() {
    const firstCell = parseInt(inPlay[0].getAttribute('id'))
    const secondCell = parseInt(inPlay[1].getAttribute('id'))
    if (firstCell === secondCell + 1 || firstCell === secondCell - 1 || firstCell === secondCell - width || firstCell === secondCell + width) {
      proximity = true
    } else {
      proximity = false
    }
  }

  // checks if you can make a move (can only move when you will crush a row/column)
  function checkColor() {
    const color = inPlay[0].classList[1]
    const index = parseInt(inPlay[1].getAttribute('id'))
    
    const tt = document.getElementById(`${index - (width * 2)}`)
    const t = document.getElementById(`${index - width}`)
    const b = document.getElementById(`${index + width}`)
    const bb = document.getElementById(`${index + (width * 2)}`)
    const ll = document.getElementById(`${index - 2}`)
    const l = document.getElementById(`${index - 1}`)
    const r = document.getElementById(`${index + 1}`)
    const rr = document.getElementById(`${index + 2}`)
    
    const arrayCheck = [[tt, t], [t,b], [b,bb], [ll, l], [l,r], [r,rr]]
    let i = 0
    while (i < arrayCheck.length && colorCheck === false) {
      if (arrayCheck[i][0] && arrayCheck[i][1] && arrayCheck[i][0].classList[1] === color && arrayCheck[i][1].classList[1] === color) {
        colorCheck = true
      } else {
        colorCheck = false
      }
      i++
    }
  }

  // function that swaps two candies
  function swap() {
    const first = inPlay[0].classList[1]
    const second = inPlay[1].classList[1]
    inPlay[0].classList.remove(first)
    inPlay[0].classList.add(second)
    inPlay[1].classList.remove(second)
    inPlay[1].classList.add(first) 
    

    firstMove = true
    
  }

  // function that loops through the grid and crushes all possible candy
  function crush() {

    const cells = document.querySelectorAll('.cell')

    for (let i = 0; i < cells.length; i++) {
      const cell = cells[i]
      //right
      const r = cells[i + 1]
      const rr = cells[i + 2]
      //left
      const l = cells[i - 1]
      const ll = cells[i - 2]
      //top
      const t = cells[i - width]
      const tt = cells[i - (width * 2)]
      //bottom
      const b = cells[i + width]
      const bb = cells[i + (width * 2)]
      
      const arrayCheck = [[tt, t], [t, b], [b, bb], [ll, l], [l, r], [r, rr]]
      for (let i = 0; i < arrayCheck.length; i++) {
        if (cell && arrayCheck[i][0] && arrayCheck[i][1] && cell.classList[1] === arrayCheck[i][0].classList[1] && arrayCheck[i][0].classList[1] === arrayCheck[i][1].classList[1]) {
          cell.classList.remove(`${cell.classList[1]}`)
          arrayCheck[i][0].classList.remove(arrayCheck[i][0].classList[1])
          arrayCheck[i][1].classList.remove(arrayCheck[i][1].classList[1])
          

          //Score aqui
          if (firstMove) {

            score += 1
            scoreKeeper.innerHTML = `<p>Score: </p><span>${score}</span>`
          }
        }
      }
    }
  }


  // function that generates random candies on the first row when candy is crushed
  function generateCandy() {
    for (let i = 0; i < width; i++) {
      const cell = document.getElementById(`${i}`)
      if (!cell.classList[1]) {
        cell.classList.add(`${colors[Math.floor(Math.random() * Math.floor(4))]}`)
      }
    }
  }

  // function that checks how many empty cells there are 
  function emptyCheck() {
    emptyCells = []
    const cells = document.querySelectorAll('.cell')
    for (let i = 0; i < cells.length; i++) {
      const cell = cells[i]
      if (!cell.classList[1]) {
        emptyCells.push(cell)
      }
    }
  }

  // function that drops candies when the one underneath them is crushed 
  function drop() {
    const cells = document.querySelectorAll('.cell')
    generateCandy()
    for (let i = 0; i < cells.length; i++) {
      const cell = cells[i]
      const b = cells[i + width]
      if (b && !b.classList[1]) {
        b.classList.add(`${cell.classList[1]}`)
        cell.classList.remove(`${cell.classList[1]}`)
      }
    }
    crush()
  }

  // function that allows the swap function to run only if the move is allowed
  function play(cell) {
    inPlay.push(cell)
    inPlay[0].classList.add('first-pick')
    if (inPlay.length === 2) {
      inPlay[0].classList.remove('first-pick')
      checkProximity()
      checkColor()
      if (proximity && colorCheck) {
        swap()
        proximity = false
        colorCheck = false
        crush()
        emptyCheck()
        while (emptyCells.length > 0) {
          drop()
          emptyCheck()
        } 
      }
      inPlay = []  
    }
  }

  // function that creates the grid HTML elements
  function createCells() {
    for (let i = 0; i < cells; i++) {
      const cell = document.createElement('div')
      cell.classList.add('cell')
      cell.classList.add(`${colors[Math.floor(Math.random() * Math.floor(4))]}`)
      cell.setAttribute('id', i)
      grid.appendChild(cell)
      cell.addEventListener('click', () => play(cell))
    }
  }

  // Grid generation
  function createBoard() {
    createCells()
    grid.style.display = 'flex'
    scoreKeeper.innerHTML = `<p>Score: </p><span>${score}</span>`
  
    crush()
    // score = 0
    emptyCheck()
    while (emptyCells.length > 0) {
      drop()
      emptyCheck()
    }
  }



  createBoard()

}

window.addEventListener('DOMContentLoaded', init)