import React from "react";

function IsThere({ channels, roleUser }) {
  const isChannelPresentInRoleUser = channels.some((channel) => {
    return roleUser.some((role) => channel.channel_name === role.channel_name);
  });

  return (
    <div>
      {isChannelPresentInRoleUser ? (
        <p>Il canale è presente in roleUser!</p>
      ) : (
        <p>Il canale non è presente in roleUser.</p>
      )}
    </div>
  );
}

export default IsThere;
