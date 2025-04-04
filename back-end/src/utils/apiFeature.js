export class ApiFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  paginate() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 10;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);
    return this;
  }

  async getPaginationInfo() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 10;

    const totalCount = await this.query.model.countDocuments(
      this.query.getQuery()
    );

    const totalPages = Math.ceil(totalCount / limit);

    return {
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
      totalPages,
      currentPage: this.page,
    };
  }
}

