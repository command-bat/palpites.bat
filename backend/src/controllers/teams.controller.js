const Team = require("../models/team.model");

exports.getTeamById = async (req, res) => {
    const team = await Team.findOne({ id: req.params.id });

    if (!team) {
        return res.status(404).json({ message: "Team not found" });
    }

    res.json(team);
};
