const Job = require("../model/Job");
const JobUtils = require("../utils/JobUtils");
const Profile = require("../model/Profile");

module.exports = {
  index(req, res) {
    let statusCount = {
      progress: 0,
      done: 0,
      total: Job.get().length,
    };

    const updatedJobs = Job.get().map((job) => {
      const remaining = JobUtils.remainingDays(job);
      const status = remaining <= 0 ? "done" : "progress";

      statusCount[status] += 1;

      return {
        ...job,
        remaining,
        status,
        budget: JobUtils.calculateBudget(job, Profile.get()["hour-value"]),
      };
    });

    return res.render("index", {
      jobs: updatedJobs,
      profile: Profile.get(),
      statusCount: statusCount,
    });
  },
};
