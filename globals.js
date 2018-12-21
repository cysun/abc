const accepeted_images = [
    "png", "jpg", "jpeg", "bmp"
];
const user_act_types = [
    "AVAILABLE", "UNDER_REVIEW", "COMPLETED", "REJECTED"
];

const act_types = [
    "AVAILABLE", "NOT_AVAILABLE"
];

const user_acts_sort_categories = [
    'name', 'total_number_of_completions', 'total_number_of_clicks', 'creation_date', 'reward_points'
];

const user_acts_order_categories = [
    1, -1
];

module.exports = {
    act_types,
    user_act_types,
    accepeted_images,
    user_acts_sort_categories,
    user_acts_order_categories
}