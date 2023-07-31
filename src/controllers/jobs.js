const Job = require('../models/Job')
const { BadRequestError, NotFoundError } = require('../errors')

const getAllJobs = async (req, res, next) => {
    try {
        const jobs = await Job.find({ createdBy: req.user.userId }).sort('createdAt')
        res.status(200).json({ jobs, count: jobs.length, message: "OK" })
    }
    catch (err) {
        next(err)
    }
}
const getJob = async (req, res, next) => {
    try {
        const {
            user: { userId },
            params: { id: jobId },
        } = req

        const job = await Job.findOne({
            _id: jobId,
            createdBy: userId,
        })
        if (!job) {
            throw new NotFoundError(`No job with id ${jobId}`, 404)
        }
        res.status(200).json({ job })
    }
    catch (error) {
        next(error);
    }
}

const createJob = async (req, res) => {

    req.body.createdBy = req.user.userId;
    const job = await Job.create(req.body);
    res.status(201).json({
        job: job
    })
}

const updateJob = async (req, res, next) => {
    try {
        const {
            body: { company, position },
            user: { userId },
            params: { id: jobId },
        } = req

        if (company === '' & position === '') {
            throw new BadRequestError('Company or Position fields cannot be empty', 400);
        }
        const job = await Job.findByIdAndUpdate(
            { _id: jobId, createdBy: userId },
            req.body,
            { new: true, runValidators: true }
        )
        if (!job) {
            throw new NotFoundError(`No job with id ${jobId}`, 404)
        }
        res.status(200).json({ job })
    }
    catch (error) {
        next(error);
    }
}

const deleteJob = async (req, res, next) => {
    try {
        const {
            user: { userId },
            params: { id: jobId },
        } = req



        const job = await Job.findOne({
            _id: jobId,
            createdBy: userId,
        })
        if (!job) {
            throw new NotFoundError(`No job with id ${jobId}`, 404)
        }

        await Job.deleteJob(job._id);
        res.status(200).json({ job })
    }
    catch (error) {
        next(error);
    }
}

module.exports = {
    createJob,
    deleteJob,
    getAllJobs,
    updateJob,
    getJob,
}
