import { useState, useEffect } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { Menu, MenuItem } from "@mui/material";
import { useDispatch } from "react-redux";
import { deleteMessage } from "../redux/Message/Action";

const MessageCard = ({
  isReqUserMessage,
  content,
  handleEditMessage,
  messageId,
  token,
  messageDate,
  messageTime,
  isGroup,
  sender,
  showDateHeader,
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [localContent, setLocalContent] = useState(content);

  const dispatch = useDispatch();

  useEffect(() => {
    setLocalContent(content);
  }, [content]);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    handleMenuClose();
    if (handleEditMessage) {
      handleEditMessage(
        localContent.startsWith("Edit: ")
          ? localContent.substring(6)
          : localContent,
        messageId
      );
    }
  };

  const handleDelete = () => {
    setLocalContent("This message was deleted");
    dispatch(deleteMessage({ messageId, token }));
    handleMenuClose();
  };

  const isImage = localContent.match(/\.(jpeg|jpg|gif|png)$/i);
  const isGif = localContent.includes("giphy.com/media");
  const isVideo = localContent.match(/\.(mp4|webm|ogg)$/i);

  const editPrefix = localContent.startsWith("Edit: ") ? "Edit: " : "";
  const mainContent = localContent.startsWith("Edit: ")
    ? localContent.substring(6)
    : localContent;

  return (
    <>
      {showDateHeader && (
        <div className="flex justify-center items-center">
          <p className="w-fit bg-[#2563eb5c] p-1 m-2 rounded-lg text-sm">
            {messageDate}
          </p>
        </div>
      )}
      <div
        className={`relative flex ${
          isReqUserMessage
            ? "self-start bg-white"
            : "self-end bg-blue-600 text-white"
        } space-x-2 p-2 rounded-md ${
          isImage || isGif || isVideo
            ? "max-w-[70%] sm:max-w-[50%]"
            : "max-w-[60%]"
        }`}
        style={{ wordBreak: "break-word" }}
      >
        {isImage || isGif || isVideo ? (
          <div className="relative w-full">
            {isGroup && (
              <p
                className={`block text-sm font-semibold ${
                  isReqUserMessage ? "text-[#d0b00a]" : "text-[#ffe97a]"
                }`}
              >
                ~ {sender.full_name}
              </p>
            )}
            {isImage || isGif ? (
              <img
                src={localContent}
                alt="content"
                className="media-card-image max-w-full h-auto rounded-md"
              />
            ) : isVideo ? (
              <video
                src={localContent}
                controls
                className="media-card-video rounded-md"
                style={{
                  width: "300px", // Fixed width
                  height: "200px", // Fixed height
                  objectFit: "cover", // Cover to maintain aspect ratio
                }}
              />
            ) : null}
            <p className="text-xs absolute bottom-1 right-1 bg-gray-800 bg-opacity-50 text-white p-1 rounded">
              {messageTime}
            </p>
            {!isReqUserMessage && (
              <BsThreeDotsVertical
                className="absolute top-2 right-2 bg-gray-800 bg-opacity-50 p-[2px] rounded cursor-pointer text-white text-lg"
                onClick={handleMenuOpen}
              />
            )}
          </div>
        ) : (
          <div className="flex flex-col w-full relative">
            {isGroup && (
              <div>
                <p
                  className={`block text-sm font-semibold ${
                    isReqUserMessage ? "text-[#d0b00a]" : "text-[#ffe97a]"
                  }`}
                >
                  ~ {sender.full_name}
                </p>
              </div>
            )}
            <div className="flex justify-between items-start w-full">
              <div className="flex-grow break-words">
                <p
                  className={`${
                    localContent === "This message was deleted" ? "italic" : ""
                  }`}
                >
                  {editPrefix && <span className="italic">{editPrefix}</span>}
                  {mainContent}
                </p>
              </div>
              <div className="h-full flex flex-col justify-between items-end ml-2">
                {!isReqUserMessage &&
                  localContent !== "This message was deleted" && (
                    <BsThreeDotsVertical
                      className="cursor-pointer text-lg"
                      onClick={handleMenuOpen}
                    />
                  )}
                <p className="text-xs mb-1 whitespace-nowrap">{messageTime}</p>
              </div>
            </div>
          </div>
        )}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          anchorOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
        >
          {!isImage && !isGif && !isVideo && (
            <MenuItem sx={{ color: "blue" }} onClick={handleEdit}>
              Edit
            </MenuItem>
          )}
          <MenuItem sx={{ color: "red" }} onClick={handleDelete}>
            Delete
          </MenuItem>
        </Menu>
      </div>
    </>
  );
};

export default MessageCard;
