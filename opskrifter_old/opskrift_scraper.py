import requests
import json
from bs4 import BeautifulSoup

def get_urls(soup):
    paths = [
        link.get('href')
        for link in soup.findAll(
            'a', {"class": "link d-block p-relative card__image-container"}
        )
    ]
    paths.pop(len(paths)-1)
    return [f'https://www.bbcgoodfood.com{path}' for path in paths]

def parse_title(soup):
    return soup.find("h1", {"class": "heading-1"}).text

def parse_description(soup):
    method_desc_arr = soup.find("div", {"class": "editor-content"})
    arr = [x.text for x in method_desc_arr]
    return arr[0]

def parse_size(soup):
    classes = soup.findAll("div", {"class": "icon-with-text__children"})
    return classes[2].text[-1]

def parse_ingredients(soup):
    ingredient_li = soup.findAll("li", {"class": "pb-xxs pt-xxs list-item list-item--separator"})
    return [li.text for li in ingredient_li]

def parse_time(soup):
    prep_time = int(soup.findAll("time")[0].text.replace(' mins', '').replace(' hr', '').replace(' and ', ''))
    cook_time = int(soup.findAll("time")[1].text.replace(' mins', '').replace(' hr', '').replace(' and ', ''))
    return prep_time + cook_time

def parse_method(soup):
    method_step_arr = soup.findAll("span", {"class": "mb-xxs heading-6"})
    method_step = [x.text for x in method_step_arr]

    method_desc_arr = soup.findAll("div", {"class": "editor-content"})
    p_elements = [x.text for x in method_desc_arr]
    method_description = list(p_elements)
    method_description.pop(0)
    method_description.pop(len(method_description)-1)

    return "".join(
        f"{method_step[x]}: {method_description[x]}\n"
        for x in range(len(method_step))
    )

def parse_difficulty(soup):
    classes = soup.findAll("div", {"class": "icon-with-text__children"})
    return classes[1].text

def get_json(url, x):
    r = requests.get(url)
    soup = BeautifulSoup(r.text, features="lxml")

    # RecipeID
    recipeID = x

    # Title
    title = parse_title(soup)

    # Description
    description = parse_description(soup)

    # Size
    size = parse_size(soup)

    # Ingredients
    ingredients = parse_ingredients(soup)

    # Time
    time = parse_time(soup)

    # Method
    method = parse_method(soup)

    # Difficulty
    difficulty = parse_difficulty(soup)

    '''
    print(recipeID)
    print(title)
    print(description)
    print(size)
    print(ingredients)
    print(time)
    print(method)
    print(difficulty)
    '''

    return {
        "recipes": [
            {
                "recipeID": recipeID,
                "title": title,
                "description": description,
                "size": size,
                "ingredients": ingredients,
                "time": time,
                "method": method,
                "difficulty": difficulty,
                "url": url
            }
        ]
    }

    
    

def main():
    r = requests.get('https://www.bbcgoodfood.com/recipes/collection/cheap-family-suppers-recipes')
    soup = BeautifulSoup(r.text, features="lxml")

    urls = get_urls(soup)

    final_dict = {
        "recipes": [
            {
                "recipeID": 0,
                "title": "title",
                "description": "description",
                "size": "",
                "ingredients": "ingredients",
                "time": 2,
                "method": "method",
                "difficulty": "difficulty" 
            }
        ]
    }
    for count, url in enumerate(urls):
        temp_dict = get_json(url, count)
        final_dict["recipes"].append(temp_dict)
        final_json = json.dumps(final_dict, indent = 4)

    with open("opskrifter/recipes.json", "w") as file:
        file.write(final_json)
        
if __name__=='__main__':
    main()
