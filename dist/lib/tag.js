"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tag = void 0;
const version_1 = require("./version");
class Tag {
    constructor(version) {
        this.version = version;
        this.ref = `refs/tags/${this.toString()}`;
        this.majorRef = `refs/tags/${this.toMajorString()}`;
    }
    static parseTag(tag) {
        const version = version_1.SemVer.parse(tag.substring(Tag.PREFIX.length));
        return new Tag(version);
    }
    static parseVersion(version) {
        return new Tag(version_1.SemVer.parse(version));
    }
    toMajorString() {
        return `${Tag.PREFIX}${this.version.major}`;
    }
    toString() {
        return `${Tag.PREFIX}${this.version.toString()}`;
    }
}
exports.Tag = Tag;
Tag.PREFIX = 'v';
