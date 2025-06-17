from .models import Location, Route


def find_route(
    source_district, destination_district, budget=None, days=None, category=None
):
    route = [source_district, destination_district]
    visited = set(route)

    def dfs(current_location_name):
        current_location = Location.objects.get(name=current_location_name)
        next_routes = Route.objects.filter(source=current_location).exclude(
            destination__name__in=visited
        )
        next_locations = sorted(
            [r.destination for r in next_routes],
            key=lambda loc: loc.rating,
            reverse=True,
        )
        for loc in next_locations:
            visited.add(loc.name)
            route.append(loc.name)
            dfs(loc.name)

    dfs(destination_district)
    return route
