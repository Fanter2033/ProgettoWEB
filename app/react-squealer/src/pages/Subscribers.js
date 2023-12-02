/*
import React from "react";
import { useState } from "react";

import ReactConfig from "../config/ReactConfig";
import { useUserContext } from "../config/UserContext";

import "../css/App.css";

function Subscribers(channel) {
  const { userGlobal, setUserGlobal } = useUserContext();

  const [iscritto, setIscritto] = useState

  const [following, setFollowing] = useState([]);
  async function isSubscribed(channel) {
    const subscribersList = () => {
      //GET /channel/{type}/{channel_name}/users/     list of following
      const url = `${ReactConfig.base_url_requests}/channel/${channel.type}/${channel.channel_name}/users/`;
      fetch(url)
        .then((response) => response.json())
        .then((data) => {
          console.log("Following of a channel:", data.content);
          setFollowing(data.content);
        })
        .catch((error) => {
          console.error("Failed to get the following, errore:", error);
        });
    };

    const iscritto = subscribersList.includes(userGlobal.name);
    console.log("ISCRITTO?", iscritto);
  }

  const [myRole, setMyRole] = useState([]);
  //PATCH /channel/{type}/{channel_name}  follow channel
  async function follow(channel) {
    const url = `${ReactConfig.base_url_requests}/channel/${channel.type}/${channel.channel_name}`;
    const options = {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      mode: "cors",
    };

    fetch(url, options)
      .then((res) => {
        console.log(res);
        if (res.ok) {
          return res.json();
        }
      })
      .then((data) => {
        console.log("Subscribe went good", data);
      })
      .catch((error) => {
        console.error("Subscribe failed, error:", error);
      });

    const url2 = `${ReactConfig.base_url_requests}/channel/${channel.type}/${channel.channel_name}/users/${userGlobal.username}`;
    fetch(url2)
      .then((response) => response.json())
      .then((data) => {
        console.log("Get the role of the user:", data);
        setMyRole(data);
      })
      .catch((error) => {
        console.error("Faillllllll, errore:", error);
      });
  }
  //TODO: DELETE /channel/{type}/{name}/users/{username}/ unfollow
  async function unfollow(channel) {
    const uri = `${ReactConfig.base_url_requests}/channel/${channel.type}/${channel.channel_name}user/${userGlobal.username}`;
    const options = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      mode: "cors",
    };

    fetch(uri, options)
      .then((response) => {
        if (response.ok) {
          console.log("Delete role successful :)");
        } else {
          console.error("Delete role failed :(", response.statusText);
        }
      })
      .catch((error) => {
        console.error("Network error", error);
      });
  }

  return (
    <div>
      {iscritto ? (
        <button
          className="custom-button"
          onClick={() => {
            follow(channel);
          }}
        >
          NON ISCRITTO
        </button>
      ) : (
        <button
          className="custom-button"
          onClick={() => {
            unfollow(channel);
          }}
        ></button>
      )}
    </div>
  );
}

export default Subscribers;
*/