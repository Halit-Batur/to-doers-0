import React, { useState } from "react";
import { Button } from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import { useSelector } from "react-redux";
import EditIcon from "@material-ui/icons/Edit";
import DoneRoundedIcon from "@material-ui/icons/DoneRounded";
import CheckCircleOutlineOutlinedIcon from "@material-ui/icons/CheckCircleOutlineOutlined";
import { Draggable } from "react-beautiful-dnd";
import styled from "styled-components";

const Container = styled.div`
  border: 1px solid grey;
  padding: 8px;
  margin-bottom: 4px;
  border-radius: 5px;
  background-color: #00aecc;
`;

export default function BoardItem(props) {
  const db = useSelector((state) => state.value);
  const [isOnEditMode, setEditMode] = useState(false);
  const [data, setData] = useState(props.data);

  const deleteItem = () => {
    db.collection("boardstest")
      .doc(props.boardId)
      .collection("boardItems")
      .doc(`${props.itemId}`)
      .delete();
  };

  const editItem = (e) => {
    e.preventDefault();
    e.persist();
    const newData = {
      name: e.target[0].value,
      dueDate: e.target[1].value,
      assignedTo: e.target[2].value.split(" "),
    };
    db.collection("boardstest")
      .doc(props.boardId)
      .collection("boardItems")
      .doc(`${props.itemId}`)
      .update(newData);

    setData({ ...data, ...newData });
    setEditMode(false);
  };

  const completed = () => {
    db.collection("boardstest")
      .doc(props.boardId)
      .collection("boardItems")
      .doc(`${props.itemId}`)
      .update({
        completed: true,
      });

    setData({ ...data, completed: true });
  };

  return (
    <Draggable draggableId={props.itemId} index={props.index}>
      {(provided) => (
        <Container
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
        >
          {!data.completed && (
            <div>
              <Button onClick={() => completed()}>
                <CheckCircleOutlineOutlinedIcon />
              </Button>
              <span>{data.name}</span>
              <Button onClick={() => setEditMode(!isOnEditMode)}>
                <EditIcon />
              </Button>

              {isOnEditMode && (
                <form onSubmit={(e) => editItem(e)}>
                  Name of the item:{" "}
                  <input type="text" defaultValue={data.name} />
                  <br />
                  Due Date: <input type="date" defaultValue={data.dueDate} />
                  <br />
                  Assigned To:{" "}
                  <input
                    type="text"
                    placeholder=""
                    defaultValue={data.assignedTo.join(" ")}
                  />
                  <br />
                  <Button type="submit">
                    <i>Save Changes</i>
                    <DoneRoundedIcon />
                  </Button>
                </form>
              )}
              <Button onClick={deleteItem}>
                <DeleteIcon />
              </Button>
              {data.dueDate !== "" && <span> Due date: {data.dueDate}</span>}
            </div>
          )}
        </Container>
      )}
    </Draggable>
  );
}
