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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ItemsController = void 0;
const client_1 = require("@prisma/client");
const fs = require('fs');
const prisma = new client_1.PrismaClient();
class ItemsController {
    home(req, res) {
        res.render('home', {
            admin: req.session.admin
        });
    }
    index(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let page = Number(req.query.page); // localhost?page=4
            const count = yield prisma.items.count({});
            let pages = Math.ceil(count / 4);
            if (!page)
                page = 1;
            if (page > pages)
                page = pages;
            const items = yield prisma.items.findMany({
                take: 4,
                skip: (page - 1) * 4,
            });
            const categories = yield prisma.categories.findMany();
            res.render('items/index', {
                'items': items,
                number: Number(pages),
                categories: categories,
                admin: req.session.admin
            });
        });
    }
    category(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const items = yield prisma.items.findMany();
            const categories = yield prisma.categories.findMany();
            res.render('items/category/:name', {
                'items': items,
                categories: categories,
                admin: req.session.admin
            });
        });
    }
    show(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const item = yield prisma.items.findUnique({
                where: {
                    id: Number(req.params.id)
                }
            });
            const categories = yield prisma.categories.findMany();
            res.render('items/show', {
                'item': item,
                categories: categories,
                admin: req.session.admin
            });
        });
    }
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (req.session.admin) {
                const categories = yield prisma.categories.findMany();
                res.render('items/create', {
                    categories: categories,
                    admin: req.session.admin
                });
            }
            else {
                res.redirect('/');
            }
        });
    }
    store(req, res) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const { title, categ_id, description } = req.body;
            console.log(String((_a = req.file) === null || _a === void 0 ? void 0 : _a.originalname));
            yield prisma.items.create({
                data: {
                    title,
                    image: String((_b = req.file) === null || _b === void 0 ? void 0 : _b.originalname),
                    category: {
                        connect: {
                            id: Number(categ_id)
                        }
                    },
                    description,
                    // categ_id: Number(categ_id),
                }
            });
            res.redirect('/items');
        });
    }
    destroy(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.body;
            yield prisma.items.deleteMany({
                where: {
                    id: Number(id)
                }
            });
            res.redirect('/');
        });
    }
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id, title, image, description } = req.body;
            yield prisma.items.update({
                where: {
                    id: Number(id)
                },
                data: {
                    title,
                    image,
                    description,
                }
            });
            res.redirect('/');
        });
    }
}
exports.ItemsController = ItemsController;
