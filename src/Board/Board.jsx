import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import './board.css'
export default class Board extends Component {
    constructor(){
        super();
        let cell = new Array(8).fill(0).map(()=>new Array(8).fill(0));
        this.state={
            curChar : '',
            cellClk:0,
            curCell:'n',
            cell:cell,
            curId:'n'
        }
       
    }
    componentDidMount(){
        let cell = document.getElementById('ze');
        let board = document.getElementById('board-id');
        let row=0,col=0;
        for(let i=0;i<64;i++){
            let cln = cell.cloneNode(true);
            cln.id=row+'-'+col;
            if(row%2===0){
               i%2===0?cln.style.backgroundColor="#F5CBA7":cln.style.backgroundColor="#AF601A";
            }
            else if(row%2!==0){
                i%2!==0?cln.style.backgroundColor="#F5CBA7":cln.style.backgroundColor="#AF601A";
               // cln.innerHTML="&#9820;";
            }
            cln.addEventListener('click',(e)=>{
                this.placeChar(e.target.id,'c',e)
            });
            cln.addEventListener('mouseover',(e)=>{
                this.placeChar(e.target.id,'o')
            });
            board.appendChild(cln);
            col++;
            if(col===8){
                col=0;
                row++;
            }
            
        }
      
    }

  /*check the validity of the visited cell */

  isValidCell(curRow,curCol){
    if(
    curRow < 0 || curRow >= 8 ||
    curCol < 0 || curCol >= 8){
        return false;
    }
    return true;
}

    /* Save the current selecter piece for move/placement */
    placeBoard(e,id){
        this.clearBoard();
        let cngClr = document.getElementById(id);
        //cngClr.style.backgroundColor="red"
        this.setState({
            curChar:e,
            curId:id
        });
        this.Toast(id);
    }
    /* Just placement the chese piece after select it */
    placeChar(id,event,e){
        //cell.style.transform='scale(1.3)';
        let temp = this.state.cell;
        if(event==='o'){
           
           let curC = id.split('-');
            //console.log(curC[0]+' '+curC[1])
           // console.log(temp[curC[0]][curC[1]])
           if(temp[curC[0]][curC[1]]===0){
           
           if(this.state.curCell !=='n'){
            this.searchPath(this.state.curId,id);
            let cell = document.getElementById(this.state.curCell);
            cell.innerHTML='';
           }
           this.setState({
               curCell:id
           });
           let hoverCell = document.getElementById(id);
           hoverCell.innerHTML=this.state.curChar;
        }
        }
        //When Click into the cell then the character will fixed its current cell position
        if(event==='c'){
           // alert(this.state.curId);
            if(this.state.curId !=="n"){
            //alert('cng in')
            let curC = this.state.curCell.split('-');
            // let temp = [...this.state.cell];
            // temp[curC[0]][curC[1]] = 1;
            var copy = JSON.parse(JSON.stringify(this.state.cell));
            copy[curC[0]][curC[1]] = 1;
            this.setState({
                cell:copy
            });
            this.searchPath(this.state.curId,this.state.curCell);
            //temp=[];
            this.setState({
                curCell:'n',
                curChar:'',
                curId:'n'
            });
        }
        else{
           // alert(e.target.id)
           this.clearBoard();
           this.searchPath(e.target.innerHTML,e.target.id);
        }
        }
    }

    /* Search the path it can move */
    searchPath(which,cellFrom){

        if(which==='rock' || which === '♜'){
            this.playRock(cellFrom);
        }
        if(which === 'knight' || which === '♞'){
            this.playKnight(cellFrom);
        }
        if(which==='bishop' || which === '♝'){
            this.playBishop(cellFrom);
        }
        if(which==='queen' || which === '♛'){
            this.playQueen(cellFrom);
        }

        if(which==='king' || which==='♚'){
            this.playKing(cellFrom);
        }

        if(which==='pawn' || which==='♟'){
            this.playPawn(cellFrom,which);
        }
    }

    /* for play of : pieces  [Rock,Bishop,Queen]*/
     
    visitFullCell(row,col,cellFrom,isKing){
        let posCell = cellFrom.split('-');
        let res = [];
        let cnt = 0;
        let cutPos = 0;
        let len;
        len=row.length;
        while(cnt < 1){
          for(let i=0;i<len;i++){
              let curRow = parseInt(posCell[0])+ parseInt(row[i]),curCol =  parseInt(posCell[1])+ parseInt(col[i]);
              if(!this.isValidCell(curRow,curCol)
                 ){  //Check cell validity
                    col[i]=99;
                    row[i]=99;
                    //cnt++;
                    //alert(cnt + ' cn '+curRow+' '+curCol);
                 }
                 else{
                    // alert(curRow+' c r c '+ curCol)
                     if(this.state.cell[curRow][curCol] !== 1){

                         res.push(curRow+'-'+curCol);
                         if(row[i]!==0){
                            row[i]<0?row[i]=row[i]-1:row[i]=row[i]+1;
                         }
                         if(col[i]!==0){
                             col[i]<0?col[i]=col[i]-1:col[i]=col[i]+1;
                          }
                     }
                     else if(this.state.cell[curRow][curCol] === 1){
                      if(isKing!=='p'){
                      res.push(curRow+'-'+curCol+'-'+'r');
                      }
                      else{
                          return res;
                      }
                      cutPos++;
                      if(col[i]!==99 && row[i]!==99){
                      col[i]=99;
                      row[i]=99;
                     // cnt++;
                      //alert(cnt + ' cn '+curRow+' '+curCol);
                      }
                     }
                 }
          }
          let nn = 0;
        isKing==='k'?cnt++:cnt=cnt;
        isKing==='p'?cnt++:cnt=cnt;
          for(let i=0;i<4;i++){
              if(row[i]===99){
                  nn++;
              }
          }
          if(nn===4){
              cnt++;
          }
        }
        return res;
    }

    /* Move the rock  */

    playRock(cellFrom){
        //alert(cellFrom)
        let row = [-1,1,0,0],col = [0,0,1,-1];
        let res = this.visitFullCell(row,col,cellFrom);
       // console.log(this.state.cell);
        this.clearBoard();
        this.animate(res,cellFrom);
        //console.log(res);
    }
    

      /* move the knight  */

      playKnight(cellFrom){
          let res = [];
          let cellPos = cellFrom.split('-');
          let row = [[2],[-1,1],[-2],[-1,1]], col = [[-1,1],[-2],[-1,1],[2]];
          for(let i=0;i<4;i++){
              for(let j=0;j<row[i].length;j++){

                 for(let k=0;k<col[i].length;k++){
                       let curRow =parseInt(row[i][j]) + parseInt(cellPos[0]);
                       let curCol =parseInt(col[i][k]) + parseInt(cellPos[1]);
                      // alert(row[i][j]+' r c '+col[i][k])
                       if(this.isValidCell(curRow,curCol)){
                           if(this.state.cell[curRow][curCol]===0){
                               res.push(curRow+'-'+curCol);
                           }
                           else if(this.state.cell[curRow][curCol]===1){
                               res.push(curRow+'-'+curCol+'-'+'r');
                           }
                       }
                  }
              }
          }
          this.clearBoard();
          this.animate(res,cellFrom);

      }
     
      /* Move the bishop */

      playBishop(cellFrom){
          let row = [-1,-1,1,1],col = [-1,1,-1,1];
          let res = this.visitFullCell(row,col,cellFrom);
          // console.log(this.state.cell);
           this.clearBoard();
           this.animate(res,cellFrom);
      }

      /*play Queen */
      playQueen(cellFrom){
        let row = [-1,-1,1,1,-1,1,0,0],col = [-1,1,-1,1,0,0,1,-1];
        let res = this.visitFullCell(row,col,cellFrom);
        // console.log(this.state.cell);
         this.clearBoard();
         this.animate(res,cellFrom);
      }

      /* play King */
     playKing(cellFrom){
        let row = [-1,-1,1,1,-1,1,0,0],col = [-1,1,-1,1,0,0,1,-1];
        let res = this.visitFullCell(row,col,cellFrom,'k');
         this.clearBoard();
         this.animate(res,cellFrom);
     }

     /* play Pawn */

    playPawn(cellFrom,which){
       if(which==='♟'){
        let res = [];
        let posCell = cellFrom.split('-');
        let curRow = parseInt(posCell[0]-1),curCol = parseInt(posCell[1]);
        let curRow2 = parseInt(posCell[0]-1),curCol2 = parseInt(posCell[1]-1);
        let curRow3 = parseInt(posCell[0]-1),curCol3 = parseInt(posCell[1])+parseInt(1);
        if(this.isValidCell(curRow,curCol)){
          if(this.state.cell[curRow][curCol]===1){
             res.push(curRow+'-'+curCol+'-'+'r');
          }
          else{
            res.push(curRow+'-'+curCol);
          }
        }
        if(this.isValidCell(curRow2,curCol2)){
            if(this.state.cell[curRow2][curCol2]===1){
                res.push(curRow2+'-'+curCol2+'-'+'r');
             }
        }
        if(this.isValidCell(curRow3,curCol3)){
            if(this.state.cell[curRow3][curCol3]===1){
                
                res.push(curRow3+'-'+curCol3+'-'+'r');
             }
        }
        this.clearBoard();
        this.animate(res,cellFrom);
       }
       else{
        let row = [-1,-2],col = [0,0];
        //for(let i=0;i<)
        let res = this.visitFullCell(row,col,cellFrom,'p');
         this.clearBoard();
         this.animate(res,cellFrom);
       }
    }


    /*clear board */
    clearBoard(){
        let row=0,col=0;
        for(let i=0;i<64;i++){
            let id=row+'-'+col;
            let cln = document.getElementById(id);
            if(row%2===0){
               i%2===0?cln.style.backgroundColor="#F5CBA7":cln.style.backgroundColor="#AF601A";
            }
            else if(row%2!==0){
                i%2!==0?cln.style.backgroundColor="#F5CBA7":cln.style.backgroundColor="#AF601A";
               // cln.innerHTML="&#9820;";
            }
            col++;
            if(col===8){
                col=0;
                row++;
            }
        }
    }

    /* Animate the path */

    animate(arr,cellFrom){
        let pos = document.getElementById(cellFrom);
        console.log(cellFrom)
        pos.style.backgroundColor='#2C5F2D'
        for(let i=0;i<arr.length;i++){
            let red = arr[i].split('-');
            if(red.length > 2){
               let cur = arr[i].substring(0,arr[i].length-2);
               let curr = document.getElementById(cur);
               curr.style.backgroundColor="red";
            }
            else{
                let curr = document.getElementById(arr[i]);
                curr.style.backgroundColor="#97BC62FF";
            }
           
        }
    }

    /*clear All*/
    clearAll(){
        let cell = new Array(8).fill(0).map(()=>new Array(8).fill(0));
        let row=0,col=0;
        this.clearBoard();
        for(let i=0;i<64;i++){
            let id=row+'-'+col;
            let cln = document.getElementById(id);
            cln.innerHTML='';
            col++;
            if(col===8){
                col=0;
                row++;
            }
        }
        this.setState({
            curChar : '',
            cellClk:0,
            curCell:'n',
            cell:cell,
            curId:'n'
        });
    }

    /*Toast */
     Toast(name) {
        var x = document.getElementById("snackbar");
        x.className = "show";
        if(name==='rock'){
            x.innerHTML="The rook (♜) moves in a straight line either horizontally or vertically through any number of unoccupied squares, until it reaches the end of board or it is blocked by another piece. It cannot jump over other pieces";
        }
        if(name==='pawn'){
            x.innerHTML="The pawn (♟) moves forward only, one square at a time. An exception is the first time a pawn is moved, it may move forward two squares. The pawn is the only piece that cannot move backward. The pawn is also the only piece that does not capture in the same way that it moves. The pawn captures an opposing piece by moving diagonally one square  it cannot capture by moving straight ahead.";
        }
        if(name==='bishop'){
          x.innerHTML="The Bishop (♝) moves in a straight line diagonally on the board. It can move as many squares as wanted, until it meets the end of the board or another piece. The bishop cannot jump over other pieces. The bishop captures on the same path it moves, by landing on the square of the opposing piece."
            
        }
        if(name==='queen'){
            x.innerHTML="The Queen (♛) is considered the most powerful piece on the board. It can move any number of squares in a straight line - either vertically, horizontally or diagonally. The queen moves like the rook and bishop combined. Unless capturing, the queen must move to an unoccupied square; and it cannot jump over pieces. The queen captures on the same path it moves, by landing on the square of the opposing piece."
        }
        if(name==='king'){
            x.innerHTML="The King (♚) is the most important piece in chess. If the king is trapped so that its capture is unavoidable, the game is over and that player loses. The king has little mobility, so it is also considered one of the weakest pieces in the game. The king can move to any adjacent square. That is, it can move one square in any direction: horizontally, vertically, or diagonally.";
        }
        if(name==='knight'){
            x.innerHTML="The Knight (♞) is the most special piece in chess, having a flexibility that makes it a powerful piece. The knight is the only piece on the board that may jump over other pieces. The knight moves two squares horizontally or vertically and then one more square at a right-angle. The knight’s move is shaped as an “L”. The knight always lands on a square opposite in color from its initial square."
        }
        
        setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
      }

    render() {
        
        return (
         <div className="main-body">
             <div className="left-sec">
            <div className="btn">
             <button className="clr" id="rock" onClick={(e)=>{this.clearAll()}}>Clear Board</button>
             <button className="clr git" id="rock" onClick={(e)=>{window.location.href = "https://github.com/shahru1013/Chess_Pieces_moves";}}>GitHub Repo</button>
             </div>
             <div className="text">
                 <h1 style={{marginTop:'60px',color:'#EC7063'}}>Chess Pieces Move</h1>
                 <h4 style={{marginTop:'10px',color:'gray'}}><u>Chess History</u></h4>
                 <h5 style={{color:'gray',marginTop:'5px'}}>
                 The history of chess can be traced back nearly 1500 years, although the earliest origins are uncertain. The earliest predecessor of the game probably originated in India, by the 7th century AD. From India, the game spread to Persia. In Europe, chess evolved into roughly its current form in the 15th century.
                 </h5>
             </div>
             </div>
             
            <div className="board-sec" id="board-id">
                <button className="one" id="ze"></button>
            </div>
            <div className="right-sec">
            <button className="character" id="queen" onClick={(e)=>{this.placeBoard('&#9819;',e.target.id)}}>&#9819;</button>
            <button className="character" id="king" onClick={(e)=>{this.placeBoard('&#9818;',e.target.id)}}>&#9818;</button>
            <button className="character" id="rock" onClick={(e)=>{this.placeBoard('&#9820;',e.target.id)}}>&#9820;</button>
            <button className="character" id="bishop" onClick={(e)=>{this.placeBoard('&#9821;',e.target.id)}}>&#9821;</button>
            <button className="character" id="knight" onClick={(e)=>{this.placeBoard('&#9822;',e.target.id)}}>&#9822;</button>
            <button className="character" id="pawn" onClick={(e)=>{this.placeBoard('&#9823;',e.target.id)}}>&#9823;</button>
            </div>
            <div id="snackbar"></div>
        </div>
        )
    }
}
