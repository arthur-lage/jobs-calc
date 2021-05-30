const Job = require("../model/Job");
const JobUtils = require("../utils/JobUtils");
const Profile = require("../model/Profile");

module.exports = {
  index(req, res) {
    const updatedJobs = Job.get().map((job) => {
      const remaining = JobUtils.remainingDays(job);
      const status = remaining <= 0 ? "done" : "progress";

      return {
        ...job,
        remaining,
        status,
        budget: JobUtils.calculateBudget(job, Profile.get()["hour-value"]),
      };
    });

    return res.render("index", { jobs: updatedJobs });
  },

  create(req, res) {
    return res.render("job");
  },

  save(req, res) {
    const lastId = Job.get()[Job.get().length - 1]?.id || 0;

    Job.get().push({
      id: lastId + 1,
      name: req.body.name,
      "daily-hours": req.body["daily-hours"],
      "total-hours": req.body["total-hours"],
      created_at: Date.now(),
    });

    return res.redirect("/");
  },

  show(req, res) {
    const jobId = req.params.id;

    const job = Job.get().find((job) => Number(job.id) === Number(jobId));

    if (!job) {
      return res.send("Job not found");
    }

    job.budget = JobUtils.calculateBudget(job, Profile.get()["hour-value"]);

    return res.render("job-edit", { job });
  },

  update(req, res) {
    const jobId = req.params.id;

    const job = Job.get().find((job) => Number(job.id) === Number(jobId));

    if (!job) {
      return res.send("Job not found");
    }

    const updatedJob = {
      ...job,
      name: req.body.name,
      "total-hours": req.body["total-hours"],
      "daily-hours": req.body["daily-hours"],
    };

    const newJobs = Job.get().map((job) => {
      if (Number(job.id) === Number(jobId)) {
        job = updatedJob;
      }

      return job;
    });

    Job.update(newJobs);

    return res.redirect("/job/" + jobId);
  },

  delete(req, res) {
    const jobId = req.params.id;

    Job.delete(jobId);
    return res.redirect("/");
  },
};
