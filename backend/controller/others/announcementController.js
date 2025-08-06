import Announcement from "../../model/announcement.js";

export const getAnnouncement = async (req, res) => {
  try {
    const announcement = await Announcement.findByPk(1);
    if (!announcement) {
      // create a new announcement if not found
      await Announcement.create({ id: 1 });
      return res.status(200).json({ content: null, expires_at: null });
    }
    res.status(200).json(announcement);
  } catch (error) {
    console.error("Error in getAnnouncement:", error);
    res.status(500).json({ message: "Failed to retrieve announcement", error });
  }
};

export const updateAnnouncement = async (req, res) => {
  try {
    const announcement = await Announcement.findByPk(1);
    if (!announcement) {
      return res.status(404).json({ message: "Announcement not found" });
    }
    announcement.content = req.body.content;
    await announcement.save();
    res.status(200).json({ message: "Announcement updated successfully" });
  } catch (error) {
    console.error("Error in updateAnnouncement:", error);
    res.status(500).json({ message: "Failed to update announcement", error });
  }
};

export const deleteAnnouncement = async (req, res) => {
  try {
    const announcement = await Announcement.findByPk(1);
    if (!announcement) {
      return res.status(404).json({ message: "Announcement not found" });
    }
    announcement.content = null;
    announcement.expires_at = null;
    await announcement.save();
    res.status(200).json({ message: "Announcement deleted successfully" });
  } catch (error) {
    console.error("Error in deleteAnnouncement:", error);
    res.status(500).json({ message: "Failed to delete announcement", error });
  }
};
