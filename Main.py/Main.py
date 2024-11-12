import random
import os

# Mapping of numbers to animal names
animal_map = {
    0: "    ",  # Empty space
    2: "Cat ",
    4: "Dog ",
    8: "Fox ",
    16: "Bear",
    32: "Wolf",
    64: "Lion",
    128: "Tiger",
    256: "Eleph",
    512: "Panda",
    1024: "Whale",
    2048: "Dragon"
}

def initialize_game():
    grid = [[0] * 4 for _ in range(4)]
    add_new_tile(grid)
    add_new_tile(grid)
    return grid

def add_new_tile(grid):
    empty_cells = [(r, c) for r in range(4) for c in range(4) if grid[r][c] == 0]
    if empty_cells:
        r, c = random.choice(empty_cells)
        grid[r][c] = 2 if random.random() < 0.9 else 4

def print_grid(grid):
    os.system('cls' if os.name == 'nt' else 'clear')  # Clear screen for better display
    for row in grid:
        print("+----+----+----+----+")
        print("|" + "|".join(f"{animal_map[num]:^4}" for num in row) + "|")
    print("+----+----+----+----+")

def merge_left(row):
    new_row = [num for num in row if num != 0]
    for i in range(len(new_row) - 1):
        if new_row[i] == new_row[i + 1]:
            new_row[i] *= 2
            new_row[i + 1] = 0
    new_row = [num for num in new_row if num != 0]
    return new_row + [0] * (4 - len(new_row))

def move_left(grid):
    return [merge_left(row) for row in grid]

def move_right(grid):
    return [list(reversed(merge_left(reversed(row)))) for row in grid]

def move_up(grid):
    return [list(row) for row in zip(*move_left(zip(*grid)))]

def move_down(grid):
    return [list(row) for row in zip(*move_right(zip(*grid)))]

def is_game_over(grid):
    for row in grid:
        for cell in row:
            if cell == 0:
                return False
    for r in range(4):
        for c in range(4):
            if (r > 0 and grid[r][c] == grid[r - 1][c]) or \
               (r < 3 and grid[r][c] == grid[r + 1][c]) or \
               (c > 0 and grid[r][c] == grid[r][c - 1]) or \
               (c < 3 and grid[r][c] == grid[r][c + 1]):
                return False
    return True

def main():
    grid = initialize_game()
    while True:
        print_grid(grid)
        move = input("Move (W/A/S/D): ").strip().upper()
        if move not in 'WASD':
            continue
        if move == 'W':
            grid = move_up(grid)
        elif move == 'A':
            grid = move_left(grid)
        elif move == 'S':
            grid = move_down(grid)
        elif move == 'D':
            grid = move_right(grid)
        add_new_tile(grid)
        if is_game_over(grid):
            print_grid(grid)
            print("Game Over!")
            break

if __name__ == "__main__":
    main()
set