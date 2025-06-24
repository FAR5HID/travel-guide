import logging
from .models import Location, Route

MAX_TRAVEL_MINUTES_PER_DAY = 540  # 9 hours
FOOD_COST_PER_DAY = 800
ACCOMMODATION_COST_PER_NIGHT = 800

logger = logging.getLogger(__name__)


def find_route(source_district, destination_district, budget, days, category):
    """
    Finds a route from a source to a destination district using an iterative greedy
    approach with depth-first exploration, considering budget and day constraints.
    """
    try:
        source_location = Location.objects.get(name=source_district)
    except Location.DoesNotExist:
        return []

    # Fetch all possible routes in the destination district once to reduce database queries
    all_possible_routes = list(
        Route.objects.filter(destination__district=destination_district).select_related(
            "source", "destination"
        )
    )

    # Initialization
    route = [source_location]
    visited = {source_location.name}
    # Track the depth of each location to prioritize deeper routes
    depth_map = {source_location.name: 0}

    # State variables for constraints
    current_day = 1
    time_spent_today = 0  # in minutes
    remaining_budget = budget or float("inf")

    # Handle initial costs for Day 1
    if budget:
        remaining_budget -= FOOD_COST_PER_DAY
        if remaining_budget < 0:
            return [source_location]

    while True:
        # Select next candidates
        # Find all possible next moves from any location in the current route
        # to an unvisited destination in the target district.
        candidates = [
            route_edge
            for route_edge in all_possible_routes
            if route_edge.source.name in visited
            and route_edge.destination.name not in visited
        ]
        # Sort candidates to prioritize depth, then rating.
        # Primary key: depth of the source node (descending).
        # Secondary key: rating of the destination node (descending).
        sorted_candidates = sorted(
            candidates,
            key=lambda route_edge: (
                depth_map[route_edge.source.name],
                route_edge.destination.rating,
            ),
            reverse=True,
        )

        best_move_found = False
        for route_edge in sorted_candidates:
            next_location = route_edge.destination
            travel_time = route_edge.travel_time
            travel_cost = route_edge.travel_cost
            logger.debug(
                f"Considering move to {next_location.name} with travel time {travel_time} and cost {travel_cost}"
            )

            # Tentatively calculate next state
            temp_day = current_day
            temp_time_today = time_spent_today
            cost_of_move = travel_cost
            is_new_day = False

            if (time_spent_today + travel_time) > MAX_TRAVEL_MINUTES_PER_DAY:
                is_new_day = True
                temp_day += 1
                temp_time_today = travel_time

                if budget:
                    # Accommodation for previous night + food for new day
                    cost_of_move += ACCOMMODATION_COST_PER_NIGHT + FOOD_COST_PER_DAY
                    logger.debug(
                        f"New day started, adding accommodation and food costs: {cost_of_move}"
                    )
            else:
                temp_time_today += travel_time

            # Check constraints
            if days and temp_day > days:
                logger.debug(f"Exceeds day limit: {temp_day} > {days}")
                continue  # Exceeds day limit

            if budget and remaining_budget < cost_of_move:
                logger.debug(
                    f"Exceeds budget limit: {remaining_budget} < {cost_of_move}"
                )
                continue  # Exceeds budget limit

            # If all checks pass, commit this move
            if is_new_day:
                current_day = temp_day
                time_spent_today = temp_time_today
            else:
                time_spent_today = temp_time_today

            if budget:
                remaining_budget -= cost_of_move

            logger.info(
                f"Moving to {next_location.name}, current day: {current_day}, time spent today: {time_spent_today}, remaining budget: {remaining_budget}"
            )
            route.append(next_location)
            visited.add(next_location.name)
            # Update depth for the new location
            depth_map[next_location.name] = depth_map[route_edge.source.name] + 1
            best_move_found = True
            break  # Found the best valid move, restart the search

        if not best_move_found:
            break  # No more valid locations to add, route is complete

    # Filter the generated route based on the category, always including the source or destination.
    final_route = [
        location
        for location in route
        if (location.name == source_district or location.name == destination_district)
        or (not category or category in location.category)
    ]

    return final_route
