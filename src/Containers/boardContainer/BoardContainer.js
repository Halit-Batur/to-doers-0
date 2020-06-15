import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import AddBtn from "../../Components/addBtn/AddBtn";
import SingleBoard from "../../Components/singleBoard/SingleBoard";
import SingleList from "../../Components/singleList/SingleList";
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';


export default function BoardContainer(props) {
  const db = useSelector((state) => state.value);
  const [isOnListView, shouldSetViewToList] = useState(false);
  const [boards, setBoards] = useState([]);
  const [switchState, setState] = React.useState(false);


  // Live updates the boards
  const liveUpdate = async () => {
    await db.collection("boardstest").onSnapshot((ss) => {
      const changes = ss.docChanges();
      changes.forEach((change) => {
        if (change.type === "added") {
          setBoards((boards) => [...boards, change.doc]);
        } else if (change.type === "removed") {
          setBoards((boards) => {
            const newBoards = boards.filter(
              (board) => board.id !== change.doc.id
            );

            return [...newBoards];
          });
        }
      });
    });
  };

  const deleteBoard = async (id) => {
    await db
      .collection("boardstest")
      .doc(id)
      .delete()
      .then(() => console.log("delete board with the id:" + id));

    setBoards(() => boards.filter((board) => board.id !== id));
  };
// Hello World
  const renderDemBoards = (isOnListView) => {
    return boards.map((board) => {
      console.log(board)
      return (
        isOnListView?
        <SingleList
          data={board.data()}
          boardId={board.id}
          key={board.id}
          deleteBoard={deleteBoard}
          ></SingleList> : <SingleBoard
            data={board.data()}
            boardId={board.id}
            key={board.id}
            deleteBoard={deleteBoard}
          ></SingleBoard>
      );
    });
  };

  useEffect(() => {
    liveUpdate();
  }, []);

  return (
    <div
      style={{
        gridColumn: "2/7",
        display: "grid",
        width: "100%",
      }}
    >
      <div
        style={{
          display: "grid",
        }}
      >
        {renderDemBoards(isOnListView)}
        
          <FormControlLabel
            control={<Switch checked={switchState} onChange={()=>{
            shouldSetViewToList(!isOnListView);
            renderDemBoards(isOnListView);
            setState(!switchState);
            }} name="checkedA" />}
            label="Switch Look"
          />
      </div>

      <AddBtn />
    </div>
  );
}
