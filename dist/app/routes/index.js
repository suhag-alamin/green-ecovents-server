"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_route_1 = require("../modules/auth/auth.route");
const category_route_1 = require("../modules/category/category.route");
const event_route_1 = require("../modules/event/event.route");
const booking_route_1 = require("../modules/booking/booking.route");
const review_route_1 = require("../modules/review/review.route");
const blog_route_1 = require("../modules/blog/blog.route");
const faq_route_1 = require("../modules/faq/faq.route");
const user_route_1 = require("../modules/user/user.route");
const admin_route_1 = require("../modules/admin/admin.route");
const feedback_route_1 = require("../modules/feedback/feedback.route");
const mail_route_1 = require("../modules/mail/mail.route");
const page_route_1 = require("../modules/page/page.route");
const subscriber_route_1 = require("../modules/subscriber/subscriber.route");
const router = express_1.default.Router();
const moduleRoutes = [
    {
        path: '/auth',
        route: auth_route_1.AuthRoutes,
    },
    {
        path: '/user',
        route: user_route_1.UserRoutes,
    },
    {
        path: '/admin',
        route: admin_route_1.AdminRoutes,
    },
    {
        path: '/categories',
        route: category_route_1.CategoryRoutes,
    },
    {
        path: '/events',
        route: event_route_1.EventRoutes,
    },
    {
        path: '/bookings',
        route: booking_route_1.BookingRoutes,
    },
    {
        path: '/reviews',
        route: review_route_1.ReviewRoutes,
    },
    {
        path: '/blogs',
        route: blog_route_1.BlogRoutes,
    },
    {
        path: '/pages',
        route: page_route_1.PageRoutes,
    },
    {
        path: '/faq',
        route: faq_route_1.FaqRoutes,
    },
    {
        path: '/feedbacks',
        route: feedback_route_1.FeedbackRoutes,
    },
    {
        path: '/mail',
        route: mail_route_1.MailRoutes,
    },
    {
        path: '/subscribers',
        route: subscriber_route_1.SubscriberRoutes,
    },
];
moduleRoutes.forEach(route => router.use(route.path, route.route));
exports.default = router;
