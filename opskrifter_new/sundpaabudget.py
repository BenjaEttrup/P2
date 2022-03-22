import requests
import json
from bs4 import BeautifulSoup

# https://sundpaabudget.dk/opskrifter/
# https://sundpaabudget.dk/osmanisk-gryde/

import requests

final_dict = {"recipes": []}


headers = {
    "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.51 Safari/537.36",
}

urls = [
    "https://sundpaabudget.dk/risotto-med-anderester/",
    "https://sundpaabudget.dk/mortens-and-med-tilbehoer/",
    "https://sundpaabudget.dk/spinatvafler-med-tunsalat/",
    "https://sundpaabudget.dk/pankorejer-med-peanutdressing/",
    # "https://sundpaabudget.dk/stegte-nudler-med-rejer-og-groentsager/",
    # "https://sundpaabudget.dk/ovnbagt-laks-og-groent-med-citronsauce-og-spaghetti/",
    # "https://sundpaabudget.dk/jordskokkesuppe-med-bagt-torsk/",
    # "https://sundpaabudget.dk/ristet-broed-med-aeg-tomat-og-rejer/",
    # "https://sundpaabudget.dk/panini-med-kylling-pesto-mozzarella-og-groent/",
    # "https://sundpaabudget.dk/spaghetti-squash-ala-chicken-alfredo/",
    # "https://sundpaabudget.dk/syrlig-rispilaf-med-kylling-og-blomkaal/",
    # "https://sundpaabudget.dk/one-pot-pasta-med-kyllingekebab/",
    # "https://sundpaabudget.dk/bbq-chicken-burger-m-hasselback-guleroedder/",
    # "https://sundpaabudget.dk/spaghetti-med-kyllingekoedboller-i-cremet-spinatsauce/",
    # "https://sundpaabudget.dk/osmanisk-gryde/",
    # "https://sundpaabudget.dk/panini-ala-cheeseburger/",
    # "https://sundpaabudget.dk/tortilla-ala-lamachun-tyrkisk-pizza/",
    # "https://sundpaabudget.dk/tyrkisk-pide/",
    # "https://sundpaabudget.dk/gnocchi-med-groentsagssauce-og-mozzarella/",
    # "https://sundpaabudget.dk/mexicansk-tacotaerte-med-salat/",
]


def parse_title(soup):
    return soup.find("h2", {"class": "recipe-card-title"}).text


def parse_description(soup):
    div = soup.find("div", {"class": "entry-content"})
    return div.findChildren("p")[0].text


def parse_size(soup):
    val = soup.find("input", {"class": "detail-item-adjustable-servings"})
    return int(val["value"])


def parse_ingredients(soup, x):
    amount = get_ingredient(soup, "wpzoom-rcb-ingredient-amount")
    unit = get_ingredient(soup, "wpzoom-rcb-ingredient-unit")
    if unit[x] == "":
        unit[x] = "stk"
    name = get_ingredient(soup, "wpzoom-rcb-ingredient-name")

    ingredient = {}

    json_ingredient = {name[x]: ingredient}
    json_ingredient[name[x]]["amount"] = amount[x]
    json_ingredient[name[x]]["unit"] = unit[x]

    # print(f"Name: {name} | Amount: {amount} | Unit: {unit}")

    return name, amount, unit


def get_ingredient(soup, klasse):
    ul = soup.find("ul", {"class": "ingredients-list layout-1-column"}).findChildren("li")

    amounts = []
    for li in ul:
        if li.findChildren("p"):
            p = li.findChildren("p")[0]
        else:
            continue
        if amount := p.findChildren("span", {"class": klasse}):
            amounts.append(amount[0].text)
        else:
            amounts.append("")

    return amounts


def parse_time(soup):
    prep_div = soup.find("div", {"class": "detail-item detail-item-1"})
    prep_time = int(prep_div.findChildren("p", recursive=False)[0].text)

    cook_div = soup.find("div", {"class": "detail-item detail-item-2"})
    cook_time = int(cook_div.findChildren("p", recursive=False)[0].text)

    return prep_time + cook_time


def parse_method(soup):
    # [f"{count + 1} {li.text}" for count, li in enumerate(soup.find("ul", {"class": "directions-list"}).findChildren())]
    method = []

    for stepIndex, li in enumerate(soup.find("ul", {"class": "directions-list"}).findChildren()):
        method.append(li.text)

    # print(method)

    return method


def parse_rating(soup):
    return int(soup.find("small", {"class": "wpzoom-rating-average"}).text)


def parse_image(soup):
    figure = soup.find("figure")
    return soup.findAll("img")[1]["src"]


def get_json(url, x):
    r = requests.get(url, headers=headers)
    if r.status_code != 200:
        print(f"Failed to get site with error code {r.status_code}")
        return

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

    # print(f"Ing 0: {parse_ingredients(soup, 0)}")
    name, amount, unit = parse_ingredients(soup, x)
    print(f"Name type: {type(name)}")
    ingredients = []
    # ingredient = {name}
    for x in range(len(get_ingredient(soup, "wpzoom-rcb-ingredient-amount"))):
        amountUnit = {"amount": amount[x], "unit": unit[x]}
        # print(amountUnit)
        # ingredient[name[x]].append(amountUnit)
        print(x)
        ingredient = {name[x]: {"amount": amount[x], "unit": unit[x]}}
        ingredients.append(ingredient)
        print(ingredients[x])

        # ingredients.append(name[x])
        # ingredient = {name[x]: {"amount": amount[x], "unit": unit[x]}}
        # print(ingredients)
        # print(ingredients[x])
        # ingredients[x]
    #    [parse_ingredients(soup, x) for x in range(len(get_ingredient(soup, "wpzoom-rcb-ingredient-amount")))]
    print(f"Ingredients: {ingredients}")

    # Time
    time = parse_time(soup)

    # Method
    method = parse_method(soup)
    print(method)

    # Difficulty
    rating = parse_rating(soup)

    # IMG
    image = parse_image(soup)

    # Url
    url = url
    url = url
    url = url

    return {"recipeID": recipeID, "title": title, "description": description, "size": size, "ingredients": ingredients, "time": time, "method": method, "rating": rating, "image": image, "url": url}


def main():

    for count, url in enumerate(urls):
        temp_dict = get_json(url, count)
        final_dict["recipes"].append(temp_dict)
        final_json = json.dumps(final_dict, indent=2, ensure_ascii=False)

    with open("recipes.json", "w", encoding="utf8") as file:
        file.write(final_json)


if __name__ == "__main__":
    main()
