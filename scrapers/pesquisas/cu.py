import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin
import time
import random


def get_price(node):
    price_node = node.find('span', class_='andes-money-amount__fraction')
    cents_node = node.find('span', class_='andes-money-amount__decimals')

    if price_node is not None:
        price = price_node.text.strip()
        if cents_node is not None:
            price += ',' + cents_node.text.strip()
        return price
    return None


def scrape_smartphones():
    i = 1

    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:25.0) Gecko/20100101 Firefox/25.0'
    }

    termo_busca = 'smartphone'
    tags = ['celular', 'smartphone', 'android']
    categoria = 'Celulares e Smartphones'
    termo_substituicao = ''

    base_url = f"https://lista.mercadolivre.com.br/{termo_busca}"

    resultados = []

    while True:
        try:
            page = requests.get(base_url, headers=headers)
            soup = BeautifulSoup(page.text, "html.parser")

            for div in soup.find_all('div', class_='ui-search-result__content-wrapper'):
                produto = div.find('h2', class_='ui-search-item__title')
                link = div.find("a", class_="ui-search-link")

                valor_desconto_str = get_price(div)

                imagens = []
                video = ''

                frete_gratis = bool(div.find("p", class_="ui-search-item__shipping ui-search-item__shipping--free"))

                if link is not None:
                    response_produto = requests.get(link['href'], headers=headers)
                else:
                    continue

                site_produto = BeautifulSoup(response_produto.text, 'html.parser')
                descricao = site_produto.find('p', class_='ui-pdp-description__content')

                if descricao:
                    if termo_substituicao:
                        descricao_text = '<h1>' + produto.text + '</h1>\n\n' + descricao.text.strip().replace(
                            'MercadoLivre', termo_substituicao).replace(
                            'Mercado Livre', termo_substituicao).replace(
                            'Mercado-Livre', termo_substituicao)
                    else:
                        descricao_text = '<h1>' + produto.text + '</h1>\n\n' + descricao.text.strip()
                else:
                    descricao_text = '<h1>' + produto.text + '</h1>\n\n' + produto.text

                imagem_tags = site_produto.find_all('img', class_='ui-pdp-image ui-pdp-gallery__figure__image')
                for imagem in imagem_tags:
                    if 'data-zoom' in imagem.attrs:
                        imagens.append(imagem['data-zoom'])

                sku = site_produto.find('span', class_='ui-pdp-buybox__sku-value')
                if sku:
                    sku = sku.get_text(strip=True, separator='\n')
                else:
                    sku = ''.join(random.choices('6789', k=13))

                resultado = {
                    'codigo': i,
                    'produto': produto.text if produto else 'Produto sem título',
                    'valor': valor_desconto_str if valor_desconto_str else 'Preço não encontrado',
                    'link': link['href'] if link else 'Link não encontrado',
                    'descricao': descricao_text,
                    'imagens': imagens,
                    'video': video,
                    'frete_gratis': frete_gratis,
                    'sku': sku,
                    'categoria': categoria,
                    'tags': tags
                }

                resultados.append(resultado)

                print('==========================')
                print(f"Código: {i}")
                print(f"Produto: {resultado['produto']}")
                print(f"Valor: {resultado['valor']}")
                print(f"Link: {resultado['link']}")
                print(f"Descrição: {resultado['descricao']}")
                print(f"Imagens: {', '.join(imagens) if imagens else 'Nenhuma imagem encontrada.'}")
                print(f"Video: {video if video else 'Nenhum vídeo encontrado.'}")
                print(f"Frete Grátis: {'Sim' if frete_gratis else 'Não'}")
                print(f"SKU: {sku}")
                print(f"Categoria: {categoria}")
                print(f"Tags: {', '.join(tags)}")
                print('==========================\n')

                i += 1

            next_link = soup.select_one("a.andes-pagination__link:-soup-contains(Seguinte)")

            if not next_link:
                break

            next_url = urljoin(base_url, next_link['href'])
            base_url = next_url

            time.sleep(random.uniform(0.5, 2.5))

        except Exception as e:
            print("Ocorreu um erro:", e)
            break

    return resultados


# ✅ Se quiser testar direto:
if __name__ == "__main__":
    dados = scrape_smartphones()
    print(f"Total de produtos encontrados: {len(dados)}")
