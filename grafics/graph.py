import pandas as pd
'''data = {
    "date": ["2023-01-01", "2023-01-02", "2023-01-03", "2023-01-01", "2023-01-02", "2023-01-03", "2023-01-01", "2023-01-02", "2023-01-03"],
    "price": [1000, 1100, 1200, 800, 900, 950, 500, 550, 600],
    "sold": [50, 60, 70, 40, 45, 50, 30, 35, 40],
    "rate": [4.5, 4.6, 4.7, 4.2, 4.3, 4.4, 3.9, 4.0, 4.1],
    "marketplace": ["Amazon", "Amazon", "Amazon", "eBay", "eBay", "eBay", "AliExpress", "AliExpress", "AliExpress"],

}
df = pd.DataFrame(data)
#print(df)
#df.to_csv("pd_data.csv")'''


d = pd.read_csv("real_data.csv", index_col=0)
print(d)

d['date'] = pd.to_datetime(d['date'])
by_date_sorted = d.sort_values(by='date').reset_index(drop=True)
print(by_date_sorted)
'''grouped = d.groupby('marketplace')
total_sales = grouped['sold'].sum()
print(total_sales)'''  

def calculate_rating(data):
    mean_rating = data['rate'].mean()
    m = data['sold'].min()
    price_weight = 0.001
    average_price = data['price'].mean()
    data["bayesian_rating"] = ((mean_rating * m) + (data["rate"] * data["sold"]) - (price_weight * data['price']) ) / (m + data["sold"])
    return(data)
new = calculate_rating(d)
print(new)
new.to_json('test.json')


