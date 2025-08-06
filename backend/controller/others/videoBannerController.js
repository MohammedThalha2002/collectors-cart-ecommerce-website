import VideoBanner from "../../model/videoBanner.js";

export const getVideoBanner = async (req, res) => {
  try {
    const videoBanner = await VideoBanner.findByPk(1);
    if (!videoBanner) {
      // create a new videoBanner if not found
      await VideoBanner.create({ id: 1 });
      return res.status(200).json({ url: null, description: null });
    }
    res.status(200).json(videoBanner);
  } catch (error) {
    console.error("Error in getVideoBanner:", error);
    res.status(500).json({ message: "Failed to retrieve videoBanner", error });
  }
};

export const updateVideoBanner = async (req, res) => {
  try {
    const videoBanner = await VideoBanner.findByPk(1);
    if (!videoBanner) {
      return res.status(404).json({ message: "VideoBanner not found" });
    }

    const url = req.body.url;
    // check url is a proper youtube url
    if (
      !url ||
      !(url.includes("youtube.com/watch?v=") || url.includes("youtu.be/"))
    ) {
      return res.status(400).json({ message: "Invalid youtube url" });
    }

    videoBanner.url = req.body.url;
    videoBanner.description = req.body.description;
    await videoBanner.save();
    res.status(200).json({ message: "VideoBanner updated successfully" });
  } catch (error) {
    console.error("Error in updateVideoBanner:", error);
    res.status(500).json({ message: "Failed to update videoBanner", error });
  }
};

export const deleteVideoBanner = async (req, res) => {
  try {
    const videoBanner = await VideoBanner.findByPk(1);
    if (!videoBanner) {
      return res.status(404).json({ message: "VideoBanner not found" });
    }
    videoBanner.url = null;
    videoBanner.description = null;
    await videoBanner.save();
    res.status(200).json({ message: "VideoBanner deleted successfully" });
  } catch (error) {
    console.error("Error in deleteVideoBanner:", error);
    res.status(500).json({ message: "Failed to delete videoBanner", error });
  }
};
