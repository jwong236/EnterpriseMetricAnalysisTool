function dateToSprintNumber(date) {
    const startDate = new Date('2023-01-01');
    const diffTime = Math.abs(date - startDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.floor(diffDays / 14) + 1;
}

export {dateToSprintNumber}