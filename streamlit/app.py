import streamlit as st
import pandas as pd
import json

with open('dados_pedidos.json') as f:
    data = json.load(f)

# Converte JSON em DataFrame
df = pd.DataFrame(data)

# Exibir o DataFrame no Streamlit
st.write(df)