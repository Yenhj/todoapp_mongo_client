import axios from "axios";
import React, { useState } from "react";

const ListItem = React.memo(({ item, todoData, setTodoData }) => {
  // console.log("ListItem Rendering...");
  // is Editing  false  : 목록 보여줌
  // is Editing  true  : 편집 보여줌
  const [isEditing, setIsEditing] = useState(false);
  // 제목을 출력하고 변경하는 State
  // 편집창에는 타이틀이 먼저 작성되어야 있어야 하므로
  const [editedTitle, setEditedTitle] = useState(item.title);
  // console.log(item);

  const deleteClick = (id) => {
    if (window.confirm("정말 삭제하시겠습니까?")) {
      let body = {
        id: id,
      };
      // axio를 이용해 MongDB 삭제
      axios
        .post("/api/post/delete", body)
        .then((res) => {
          console.log(res);
          // 클릭된 ID 와 다른 요소들만 걸러서 새로운 배열 생성
          const nowTodo = todoData.filter((item) => item.id !== id);
          // console.log("클릭", nowTodo);
          setTodoData(nowTodo);
        })
        .catch((err) => {
          console.log(err);
        });
    }
    // localStorage.setItem("todoData", JSON.stringify(nowTodo));
  };

  // 편집창 내용 갱신 처리
  const editChange = (event) => {
    setEditedTitle(event.target.value);
  };

  const toggleClick = (id) => {
    // map을 통해서 todoData 의 complete를 업데이트해보자
    const updateTodo = todoData.map((item) => {
      if (item.id === id) {
        item.completed = !item.completed;
      }
      return item;
    });

    // axios 를 이용해서 MongoDB complete 업데이트
    let body = {
      id: todoId,
      completed: item.completed,
    };
    // then() : 서버에서 회신(res)이 왔을때 처리
    // catch() : 서버에서 응답없을 때
    axios
      .post("/api/post/updatetoggle", body)
      .then((res) => {
        console.log(res);
        setTodoData(updateTodo);
      })
      .catch((err) => {
        console.log(err);
      });

    // 로컬에 저장(DB 저장)
    // localStorage.setItem("todoData", JSON.stringify(updateTodo));
  };

  // 현제 item.id 에 해당하는 값만 업데이트한다.
  const todoId = item.id;
  const updateTitle = () => {
    let tempTodo = todoData.map((item) => {
      // 모든 todoData 중에 현재 ID 와 같다면
      if (item.id === todoId) {
        // 타이틀 글자를 수정하겠다.
        item.title = editedTitle;
      }
      return item;
    });
    // 데이터 갱신
    // axios 를 이용해서 MongoDB 타이틀 업데이트
    let body = {
      id: todoId,
      title: editedTitle,
    };
    axios
      .post("/api/post/updatedtitle", body)
      .then((res) => {
        console.log(res.data);
        setTodoData(tempTodo);
        // 목록창으로 이동
        setIsEditing(false);
      })
      .catch((err) => {
        console.log(err);
      });
    // localStorage.setItem("todoData", JSON.stringify(tempTodo));
  };
  // 날짜 출력
  const WEEKDAY = ["일", "월", "화", "수", "목", "금", "토"];
  const showTime = (_timestamp) => {
    const date = new Date(_timestamp);
    let months = date.getMonth();
    months = months + 1 < 9 ? "0" + (months + 1) : months + 1;
    let hours = date.getHours();
    let ampm = hours >= 12 ? "p.m" : "a.m";
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    hours = hours + 1 < 9 ? "0" + hours : hours;
    // 분 표시
    let minutes = date.getMinutes();
    minutes = minutes < 10 ? "0" + minutes : minutes;
    let seconds = date.getSeconds();
    seconds = seconds < 10 ? "0" + seconds : seconds;

    let time = date.getFullYear();
    time += "/";
    time += months;
    time += "/";
    time += date.getDate();
    time += "/";
    time += WEEKDAY[date.getDay()];
    time += " ";
    time += hours;
    time += ":";
    time += minutes;
    time += ":";
    time += seconds;
    time += " ";
    time += ampm;

    return time;
  };

  if (isEditing) {
    return (
      <div className="flex items-center justify-between w-full px-4 py-1 my-2 text-gray-600 bg-gray-100">
        <div className="items-center">
          <input
            type="text"
            className="w-full px-3 py-2 mr-4 text-gray-500 bg-white border rounded"
            value={editedTitle}
            onChange={editChange}
          />
        </div>

        <div className="items-center cursor-pointer">
          <button className="px-4 py-2" onClick={updateTitle}>
            Update
          </button>
          <button className="px-4 py-2" onClick={() => setIsEditing(false)}>
            Close
          </button>
        </div>
      </div>
    );
  } else {
    return (
      <div className="flex items-center justify-between w-full px-4 py-1 my-2 text-gray-600 bg-gray-100">
        <div className="items-center">
          <input
            type="checkbox"
            defaultChecked={item.completed}
            onChange={() => toggleClick(item.id)}
          />{" "}
          <span className={item.completed ? "line-through" : "none"}>
            {item.title}
          </span>
        </div>

        <div className="items-center cursor-pointer">
          <span>{showTime(item.id)}</span>
          <button
            className="px-4"
            onClick={() => {
              setIsEditing(true);
              setEditedTitle(item.title);
            }}
          >
            Edit
          </button>
          <button onClick={() => deleteClick(item.id)}>x</button>
        </div>
      </div>
    );
  }
});

export default ListItem;
