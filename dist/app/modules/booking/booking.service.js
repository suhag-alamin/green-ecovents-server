"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingService = void 0;
/* eslint-disable @typescript-eslint/ban-ts-comment */
const client_1 = require("@prisma/client");
const http_status_1 = __importDefault(require("http-status"));
const stripe_1 = __importDefault(require("stripe"));
const config_1 = __importDefault(require("../../../config"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const paginationHelper_1 = require("../../../helpers/paginationHelper");
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const utils_1 = require("../../../shared/utils");
const createPaymentIntents = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const stripe = new stripe_1.default(config_1.default.stripe.secret_key);
    const paymentIntent = yield stripe.paymentIntents.create({
        amount: data.amount,
        currency: data.currency,
        payment_method_types: ['card'],
        receipt_email: data.email,
    });
    return {
        paymentId: paymentIntent.id,
        currency: paymentIntent.currency,
        amount: paymentIntent.amount / 100,
        clientSecret: paymentIntent.client_secret,
    };
});
const createBooking = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.booking.create({
        data,
        include: {
            event: true,
            user: true,
        },
    });
    // if (result.id) {
    //   await sendMail({
    //     subject: `Booking Confirmation of - ${result.event?.title}`,
    //     to: result.email,
    //     message: `
    //     <h1>Confirmation of Your Event Booking</h1>
    //     <p> <strong>Dear ${result.user?.firstName}</strong> ,</p>
    //     <p>We are thrilled to inform you that your event booking has been successfully confirmed! Thank you for choosing GreenEcovents to be a part of your special day.</p>
    //     <h3>Event Details:</h3>
    //     <p><strong>Event Name:</strong> ${result.event?.title}</p>
    //     <p><strong>Date:</strong>: From ${result.startDate} to ${result.endDate} </p>
    //     <p><strong>Location:</strong>: ${result.event?.location}</p>
    //     <p><strong>Your Booking ID:</strong>: ${result.id}</p>
    //     <p>Please keep this email as a reference for your booking. If you have any questions or need to make any changes, don't hesitate to contact our customer support team at contact@greenecovents.com.</p>
    //     <p>We look forward to hosting you and ensuring that your event is a memorable experience. Stay tuned for further updates and information as the event date approaches.</p>
    //     <p>Best regards,</p>
    //     <p>GreenEcovents</p>
    //     `,
    //   });
    // }
    return result;
});
const confirmBooking = (data) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    const result = yield prisma_1.default.$transaction((transactionClient) => __awaiter(void 0, void 0, void 0, function* () {
        yield transactionClient.payment.create({ data });
        const booking = yield transactionClient.booking.update({
            where: {
                id: data.bookingId,
            },
            data: {
                status: client_1.BookingStatus.confirmed,
            },
            include: {
                event: true,
                user: true,
            },
        });
        return booking;
    }));
    if (result.id) {
        yield (0, utils_1.sendMail)({
            subject: `Booking Confirmation of - ${(_a = result.event) === null || _a === void 0 ? void 0 : _a.title}`,
            to: result.email,
            message: `
      <h1>Confirmation of Your Event Booking</h1>
      <p> <strong>Dear ${(_b = result.user) === null || _b === void 0 ? void 0 : _b.firstName}</strong> ,</p>
      <p>We are thrilled to inform you that your event booking has been successfully confirmed! Thank you for choosing GreenEcovents to be a part of your special day.</p>
      <h3>Event Details:</h3>
      <p><strong>Event Name:</strong> ${(_c = result.event) === null || _c === void 0 ? void 0 : _c.title}</p>
      <p><strong>Date:</strong>: From ${result.startDate} to ${result.endDate} </p>
      <p><strong>Location:</strong>: ${(_d = result.event) === null || _d === void 0 ? void 0 : _d.location}</p>
      <p><strong>Your Booking ID:</strong>: ${result.id}</p>
      <p>Please keep this email as a reference for your booking. If you have any questions or need to make any changes, don't hesitate to contact our customer support team at contact@greenecovents.com.</p>
      <p>We look forward to hosting you and ensuring that your event is a memorable experience. Stay tuned for further updates and information as the event date approaches.</p>
      <p>Best regards,</p>
      <p>GreenEcovents</p>
      `,
        });
    }
    if (result) {
        return result;
    }
    throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Unable to confirm booking.');
});
const getBookings = (filters, paginationOptions) => __awaiter(void 0, void 0, void 0, function* () {
    const filtersData = __rest(filters, []);
    const andConditions = [];
    if (Object.keys(filtersData).length) {
        andConditions.push({
            AND: Object.keys(filtersData).map(key => {
                return {
                    [key]: {
                        equals: filtersData[key],
                    },
                };
            }),
        });
    }
    const { page, limit, skip, sortBy, sortOrder } = paginationHelper_1.paginationHelpers.calculatePagination(paginationOptions);
    const whereConditions = andConditions.length > 0 ? { AND: andConditions } : {};
    const result = yield prisma_1.default.booking.findMany({
        where: whereConditions,
        skip,
        take: limit,
        orderBy: sortBy && sortOrder
            ? {
                [sortBy]: sortOrder,
            }
            : {
                createdAt: 'desc',
            },
        include: {
            user: true,
            event: {
                include: {
                    categories: true,
                    reviews: true,
                },
            },
        },
    });
    const total = yield prisma_1.default.booking.count({
        where: whereConditions,
    });
    return {
        meta: {
            total,
            page,
            limit,
        },
        data: result,
    };
});
const getBookingsByUser = (filters, paginationOptions, user) => __awaiter(void 0, void 0, void 0, function* () {
    const filtersData = __rest(filters, []);
    const andConditions = [];
    andConditions.push({
        AND: {
            userId: user === null || user === void 0 ? void 0 : user.id,
        },
    });
    // andConditions.push({
    //   OR: [
    //     {
    //       status: BookingStatus.pending,
    //     },
    //     {
    //       status: BookingStatus.confirmed,
    //     },
    //   ],
    // });
    if (Object.keys(filtersData).length) {
        andConditions.push({
            AND: Object.keys(filtersData).map(key => {
                return {
                    [key]: {
                        equals: filtersData[key],
                    },
                };
            }),
        });
    }
    const { page, limit, skip, sortBy, sortOrder } = paginationHelper_1.paginationHelpers.calculatePagination(paginationOptions);
    // @ts-ignore
    const whereConditions = andConditions.length > 0 ? { AND: andConditions } : {};
    const result = yield prisma_1.default.booking.findMany({
        where: whereConditions,
        skip,
        take: limit,
        orderBy: sortBy && sortOrder
            ? {
                [sortBy]: sortOrder,
            }
            : {
                createdAt: 'desc',
            },
        include: {
            user: true,
            event: {
                include: {
                    categories: true,
                    reviews: true,
                },
            },
            payments: true,
        },
    });
    const total = yield prisma_1.default.booking.count({
        where: whereConditions,
    });
    return {
        meta: {
            total,
            page,
            limit,
        },
        data: result,
    };
});
const getSingleBooking = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.booking.findUnique({
        where: {
            id,
        },
        include: {
            user: true,
            event: {
                include: {
                    categories: true,
                    reviews: true,
                },
            },
        },
    });
    return result;
});
const updateBooking = (id, data) => __awaiter(void 0, void 0, void 0, function* () {
    var _e, _f, _g, _h, _j, _k, _l, _m, _o;
    const result = yield prisma_1.default.booking.update({
        where: {
            id,
        },
        data,
        include: {
            user: true,
            event: {
                include: {
                    categories: true,
                    reviews: true,
                },
            },
        },
    });
    if (data.status && result.id) {
        if (data.status === client_1.BookingStatus.confirmed ||
            data.status === client_1.BookingStatus.pending) {
            yield (0, utils_1.sendMail)({
                subject: `Booking Status Update of - ${(_e = result.event) === null || _e === void 0 ? void 0 : _e.title}`,
                to: result.email,
                message: `
      <h1>Booking Status Update of - ${(_f = result.event) === null || _f === void 0 ? void 0 : _f.title}</h1>
      <p> <strong>Dear ${(_g = result.user) === null || _g === void 0 ? void 0 : _g.firstName}</strong> ,</p>
      <p>We are writing to inform you that the status of your event booking has been updated to <strong>${result.status}</strong>! Thank you for choosing GreenEcovents to be a part of your special day.</p>
      <h3>Event Details:</h3>
      <p><strong>Event Name:</strong> ${(_h = result.event) === null || _h === void 0 ? void 0 : _h.title}</p>
      <p><strong>Booking Status:</strong> ${result === null || result === void 0 ? void 0 : result.status}</p>
      <p><strong>Date:</strong>: From ${result.startDate} to ${result.endDate} </p>
      <p><strong>Location:</strong>: ${(_j = result.event) === null || _j === void 0 ? void 0 : _j.location}</p>
      <p><strong>Your Booking ID:</strong>: ${result.id}</p>
      <p>Please keep this email as a reference for your booking. If you have any questions or need to make any changes, don't hesitate to contact our customer support team at contact@greenecovents.com </p>
      <p>Best regards,</p>
      <p>GreenEcovents</p>
      `,
            });
        }
        else if (data.status === client_1.BookingStatus.canceled) {
            yield (0, utils_1.sendMail)({
                subject: `Booking Cancellation of - ${(_k = result.event) === null || _k === void 0 ? void 0 : _k.title}`,
                to: result.email,
                message: `
      <h1>Cancellation of Your Event Booking</h1>
      <p> <strong>Dear ${(_l = result.user) === null || _l === void 0 ? void 0 : _l.firstName}</strong> ,</p>
      <p>We are sorry to inform you that your event booking has been cancelled! Thank you for choosing GreenEcovents to be a part of your special day.</p>
      <h3>Event Details:</h3>
      <p><strong>Event Name:</strong> ${(_m = result.event) === null || _m === void 0 ? void 0 : _m.title}</p>
      <p><strong>Date:</strong>: From ${result.startDate} to ${result.endDate} </p>
      <p><strong>Location:</strong>: ${(_o = result.event) === null || _o === void 0 ? void 0 : _o.location}</p>
      <p><strong>Your Booking ID:</strong>: ${result.id}</p>
      <p>Please keep this email as a reference for your booking. If you have any questions or need to make any changes, don't hesitate to contact our customer support team at contact@greenecovents.com</p>
      <p>Best regards,</p>
      <p>GreenEcovents</p>
      `,
            });
        }
    }
    return result;
});
const cancelBooking = (id, user) => __awaiter(void 0, void 0, void 0, function* () {
    var _p, _q, _r, _s;
    const result = yield prisma_1.default.booking.update({
        where: {
            id,
            userId: user === null || user === void 0 ? void 0 : user.id,
        },
        data: {
            status: client_1.BookingStatus.canceled,
        },
        include: {
            user: true,
            event: {
                include: {
                    categories: true,
                    reviews: true,
                },
            },
        },
    });
    if (result.id) {
        yield (0, utils_1.sendMail)({
            subject: `Booking Cancellation of - ${(_p = result.event) === null || _p === void 0 ? void 0 : _p.title}`,
            to: result.email,
            message: `
      <h1>Cancellation of Your Event Booking</h1>
      <p> <strong>Dear ${(_q = result.user) === null || _q === void 0 ? void 0 : _q.firstName}</strong> ,</p>
      <p>We are sorry to inform you that your event booking has been cancelled! Thank you for choosing GreenEcovents to be a part of your special day.</p>
      <h3>Event Details:</h3>
      <p><strong>Event Name:</strong> ${(_r = result.event) === null || _r === void 0 ? void 0 : _r.title}</p>
      <p><strong>Date:</strong>: From ${result.startDate} to ${result.endDate} </p>
      <p><strong>Location:</strong>: ${(_s = result.event) === null || _s === void 0 ? void 0 : _s.location}</p>
      <p><strong>Your Booking ID:</strong>: ${result.id}</p>
      <p>Please keep this email as a reference for your booking. If you have any questions or need to make any changes, don't hesitate to contact our customer support team at contact@greenecovents.com</p>
      <p>Best regards,</p>
      <p>GreenEcovents</p>
      `,
        });
    }
    return result;
});
const deleteBooking = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.$transaction((transactionClient) => __awaiter(void 0, void 0, void 0, function* () {
        const isBookingExist = yield transactionClient.booking.findUnique({
            where: {
                id,
            },
            include: {
                payments: true,
            },
        });
        if (!isBookingExist) {
            throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'The booking does not exist.');
        }
        // delete payments by id
        yield transactionClient.payment.deleteMany({
            where: {
                bookingId: isBookingExist.id,
            },
        });
        const booking = yield transactionClient.booking.delete({
            where: {
                id: isBookingExist.id,
            },
        });
        return booking;
    }));
    if (result) {
        return result;
    }
    throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Unable to delete booking');
});
const getPaymentDetails = (paymentIntentId) => __awaiter(void 0, void 0, void 0, function* () {
    var _t, _u;
    if (!paymentIntentId) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Invalid payment id.');
    }
    const stripe = new stripe_1.default(config_1.default.stripe.secret_key);
    const paymentIntent = yield stripe.paymentIntents.retrieve(paymentIntentId);
    const { id, amount, currency, receipt_email } = paymentIntent;
    const result = yield prisma_1.default.payment.findFirst({
        where: {
            paymentId: paymentIntentId,
        },
        include: {
            user: true,
        },
    });
    const paymentDetails = {
        paymentId: id,
        amount: (result === null || result === void 0 ? void 0 : result.amount) || amount / 100,
        currency,
        email: receipt_email,
        name: ((_t = result === null || result === void 0 ? void 0 : result.user) === null || _t === void 0 ? void 0 : _t.firstName) + ' ' + ((_u = result === null || result === void 0 ? void 0 : result.user) === null || _u === void 0 ? void 0 : _u.lastName),
        bookingId: result === null || result === void 0 ? void 0 : result.bookingId,
    };
    return paymentDetails;
});
const getBookingsData = (
// timeRange: ITimeRange,
// year?: number,
data) => __awaiter(void 0, void 0, void 0, function* () {
    const { timeRange, year } = data;
    const now = new Date();
    let startDate = now;
    if (timeRange === 'today') {
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    }
    else if (timeRange === '7days') {
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    }
    else if (timeRange === '1month') {
        startDate = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
    }
    else if (timeRange === 'year') {
        startDate = new Date(year || now.getFullYear(), 0, 1);
    }
    const monthNames = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
    ];
    const dayNames = [
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
    ];
    if (timeRange === 'today') {
        const hourlyData = [];
        for (let hour = 0; hour < 24; hour++) {
            const whereClause = {
                createdAt: {
                    gte: new Date(now.getFullYear(), now.getMonth(), now.getDate(), hour),
                    lt: new Date(now.getFullYear(), now.getMonth(), now.getDate(), hour + 1),
                },
            };
            const bookings = yield prisma_1.default.booking.findMany({
                where: whereClause,
                include: {
                    payments: true,
                },
            });
            const totalBookings = bookings.length;
            const totalRevenue = bookings.reduce((sum, booking) => sum +
                booking.payments.reduce((paymentSum, payment) => paymentSum + payment.amount, 0), 0);
            hourlyData.push({
                label: `${hour % 12 === 0 ? 12 : hour % 12}${hour < 12 ? 'AM' : 'PM'}`,
                totalBookings,
                totalRevenue,
            });
        }
        return hourlyData;
    }
    else if (timeRange === 'year') {
        const monthlyData = [];
        for (let month = 0; month < 12; month++) {
            const whereClause = {
                createdAt: {
                    gte: new Date(year || now.getFullYear(), month, 1),
                    lt: new Date(year || now.getFullYear(), month + 1, 1),
                },
            };
            const bookings = yield prisma_1.default.booking.findMany({
                where: whereClause,
                include: {
                    payments: true,
                },
            });
            const totalBookings = bookings.length;
            const totalRevenue = bookings.reduce((sum, booking) => sum +
                booking.payments.reduce((paymentSum, payment) => paymentSum + payment.amount, 0), 0);
            monthlyData.push({
                label: monthNames[month],
                totalBookings,
                totalRevenue,
            });
        }
        return monthlyData;
    }
    else {
        const dailyData = [];
        for (let date = startDate; date <= now; date.setDate(date.getDate() + 1)) {
            const whereClause = {
                createdAt: {
                    gte: new Date(date.getFullYear(), date.getMonth(), date.getDate()),
                    lt: new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1),
                },
            };
            const bookings = yield prisma_1.default.booking.findMany({
                where: whereClause,
                include: {
                    payments: true,
                },
            });
            const totalBookings = bookings.length;
            const totalRevenue = bookings.reduce((sum, booking) => sum +
                booking.payments.reduce((paymentSum, payment) => paymentSum + payment.amount, 0), 0);
            dailyData.push({
                label: `${dayNames[date.getDay()]}, ${date.getDate()} ${monthNames[date.getMonth()]}`,
                totalBookings,
                totalRevenue,
            });
        }
        return dailyData;
    }
});
exports.BookingService = {
    createPaymentIntents,
    createBooking,
    confirmBooking,
    getPaymentDetails,
    getBookings,
    getBookingsByUser,
    getSingleBooking,
    updateBooking,
    cancelBooking,
    deleteBooking,
    getBookingsData,
};
