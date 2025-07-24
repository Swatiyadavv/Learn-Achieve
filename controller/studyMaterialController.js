const mongoose = require("mongoose");
const StudyMaterial = require("../model/studyMaterialModel");
const Class = require("../model/classMasterModel");
const Subject = require("../model/subjectModel");

exports.addOrUpdateStudyMaterial = async (req, res) => {
  try {
    const { id, classId, subjectId, medium } = req.body;

    if (!classId || !subjectId || !medium ) {
      return res.status(400).json({ message: "Required fields are missing" });
    }

    const validMediums = ["Hindi", "English","Marathi","Semi-English"];
    if (!validMediums.includes(medium)) {
      return res.status(400).json({ message: "Medium must be 'Hindi','English','Marathi','Semi-English'" });
    }

    const classExists = await Class.findOne({ _id: classId, isActive: true });
    const subjectExists = await Subject.findOne({ _id: subjectId, status: "active" });

    if (!classExists || !subjectExists) {
      return res.status(404).json({ message: "Class or Subject not found or inactive" });
    }

    let material;

    if (id) {
      material = await StudyMaterial.findByIdAndUpdate(
        id,
        {
          class: classId,
          subject: subjectId,
          medium
        },
        { new: true, runValidators: true } // important
      );
    } else {
      material = await StudyMaterial.create({
        class: classId,
        subject: subjectId,
        medium
      });
    }

    res.status(200).json({
      message: id ? "Study material updated" : "Study material added",
      data: material
    });
  } catch (err) {
    console.error("Add/Update Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};


// ✅ Delete single or multiple
exports.deleteStudyMaterial = async (req, res) => {
  try {
    const { ids } = req.body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: "Provide array of ids to delete" });
    }

    await StudyMaterial.deleteMany({ _id: { $in: ids } });

    res.status(200).json({ message: "Study material(s) deleted successfully" });
  } catch (err) {
    console.error("Delete Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Toggle Status (active/inactive)
exports.toggleStatus = async (req, res) => {
  try {
    const { id, status } = req.body;

    if (!id || typeof status !== "boolean") {
      return res.status(400).json({ message: "ID and status (true/false) are required" });
    }

    const updated = await StudyMaterial.findByIdAndUpdate(id, { status }, { new: true });

    if (!updated) return res.status(404).json({ message: "Study material not found" });

    res.status(200).json({ message: "Status updated", data: updated });
  } catch (err) {
    console.error("Toggle Status Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

//  Get with filter & search


exports.getStudyMaterials = async (req, res) => {
  try {
    const {
      className,
      subjectName,
      medium,
      search,
      limit = 10,
      offset = 0
    } = req.query;

    const query = {};

    // Filter by class name
    if (className) {
      const classDoc = await Class.findOne({ className: { $regex: className, $options: "i" }, isActive: true });
      if (!classDoc) return res.status(404).json({ message: "Class not found" });
      query.class = classDoc._id;
    }

    // Filter by subject name
    if (subjectName) {
      const subjectDoc = await Subject.findOne({ subjectName: { $regex: subjectName, $options: "i" }, status: "active" });
      if (!subjectDoc) return res.status(404).json({ message: "Subject not found" });
      query.subject = subjectDoc._id;
    }

    // Filter by medium
    if (medium) query.medium = medium;

    // Search by material name
    if (search && search.trim() !== "") {
      query.materialName = { $regex: search.trim(), $options: "i" };
    }

    // Total count before pagination
    const totalCount = await StudyMaterial.countDocuments(query);

    // Paginated result
    const materials = await StudyMaterial.find(query)
      .populate("class", "className")
      .populate("subject", "subjectName")
      .sort({ createdAt: -1 })
      .skip(parseInt(offset))
      .limit(parseInt(limit));

    res.status(200).json({
      message: "Study materials fetched successfully",
      data: materials,
      totalCount: totalCount,
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

  } catch (err) {
    console.error("Get Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};


