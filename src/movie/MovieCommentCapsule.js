import React, { useState, useEffect } from "react";
import Comment from "./MovieComment";
import { useNavigate } from "react-router-dom";

function CommentsCapsule({ id, notify }) {
  const [items, setItems] = useState([]);
  const [dataIsLoaded, setDataIsLoaded] = useState(false);

  const navigate = useNavigate();
  const [comment, setComment] = useState("");

  function doFetch() {
    fetch("http://87.247.187.217:31921/movies/" + id + "/comments", {
      headers: new Headers({
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token'),
        'Accept': 'application/json'
      }),
    })
      .then((resp) => resp.json())
      .then((data) => {
        setItems(data.data);
        setDataIsLoaded(true);
      });
  }

  useEffect(() => {
    doFetch();
  }, [items]);

  function handleCommentChange(event) {
    setComment(event.target.value);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const response = await fetch(
      "http://87.247.187.217:31921/movies/" + id + "/comment",
      {
        headers: new Headers({
          'Content-Type': 'application/json',
          'Authorization': localStorage.getItem('token'),
          'Accept': 'application/json'
        }),
        method: "POST",
        mode: "cors",
        body: JSON.stringify({ comment: comment }),
      }
    );
    const data = await response.json();
    console.log("A comment was poseted: " + data.status + ": " + data.data);
    setComment("");
    notify(data.data);
    if (data.status == 401) {
      navigate("/login");
    }
  }

  return (
    <div className="comments">
      <h2>دیدگاه‌ها</h2>
      <form className="comment" onSubmit={handleSubmit}>
        <div className="name">دیدگاه خود را اضافه کنید:</div>
        <hr />
        <div>
          <input
            className="textarea"
            id="comment"
            name="comment"
            type="comment"
            value={comment}
            onChange={handleCommentChange}
          />
        </div>

        <button className="button" type="submit">
          ثبت
        </button>
      </form>
      {items.map(function (object, i) {
        return <Comment key={object.id} comment={object} notify={notify} />;
      })}
    </div>
  );
}

export default CommentsCapsule;
