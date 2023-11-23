const fielUpload = (news_picture_url) => {
    if (typeof news_picture_url === "string") {
        if (String(process.env.FILEUPLOAD) === "local") {
            return String(process.env.IMAGE_URL) + news_picture_url;
        } else {
            return String(process.env.GOOGLE_URL) + news_picture_url;
        }
    }
}

module.exports = { fielUpload }