import { Link } from "../type/link";
import { BaseRepository, BaseRepositoryImpl } from "./base";
import linkModel from "../model/link";

interface LinkRepository extends BaseRepository<Link> {}


class LinkRepositoryImpl extends BaseRepositoryImpl<Link> implements LinkRepository {
    constructor() {
        super(linkModel);
    }
}

export { LinkRepository, LinkRepositoryImpl }