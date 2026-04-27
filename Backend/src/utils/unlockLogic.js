const getUnlockedVideos = (course, enrolledAt) => {
    const now = new Date();
    const daysPassed = Math.floor((now - enrolledAt) / (1000 * 60 * 60 * 24));

    return course.videos.filter((v) => v.day <= daysPassed + 1);
};

module.exports = getUnlockedVideos;
