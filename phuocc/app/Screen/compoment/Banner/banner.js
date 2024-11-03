import React, { useEffect, useState } from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';
import Swiper from 'react-native-swiper';
import BannerService from '../../../Service/BannerService';
import { ApiImages } from './../../../Api/ApiImages';

const Banner = () => {
  const [banners, setBanners] = useState([]); // State để lưu danh sách banner
  const [error, setError] = useState(null); // State để lưu lỗi

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const result = await BannerService.getList(); // Gọi API để lấy danh sách banner
        const filteredBanners = result.banners.filter(banner =>
          banner.position === 'slideshow' && banner.status === 1
        ); // Lọc banner theo điều kiện position và status
        setBanners(filteredBanners); // Lưu các banner thỏa mãn điều kiện vào state
      } catch (err) {
        console.error("Error fetching banners:", err);
        setError(err); // Xử lý lỗi nếu có
      }
    };

    fetchBanners(); // Gọi hàm fetch khi component mount
  }, []);

  return (
    <View style={styles.container}>
      {error && <Text style={styles.errorText}>Error fetching banners: {error.message}</Text>}

      {banners.length > 0 ? (
        <Swiper
          style={styles.wrapper}
          autoplay={true}
          autoplayTimeout={3}
          loop={true}
          paginationStyle={styles.pagination}
          dotStyle={styles.dot}
        >
          {banners.map((banner, index) => (
            <View style={styles.slide} key={index}>
              {banner.image && (
                <Image
                  source={{ uri: `${ApiImages}/images/banner/${banner.image}` }}
                  style={styles.image} 
                />
              )}
            </View>
          ))}
        </Swiper>
      ) : (
        <Text style={styles.noBannersText}>No banners available.</Text> 
      )}
    </View>
  );
}

export default Banner;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 0, 
    overflow: 'hidden', // Giúp đảm bảo không có nội dung nào tràn ra ngoài
  },
  image: {
    width: '100%', 
    height: 180, // Giảm chiều cao của hình ảnh xuống 180 pixel
    resizeMode: 'cover',
  },
  pagination: {
    bottom: 10,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginVertical: 10,
  },
  noBannersText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 18,
    color: '#666',
  },
  wrapper: {
    height: 200, // Chiều cao của swiper có thể là 200 pixel hoặc bất kỳ giá trị nào bạn muốn
  },
  slide: {
    flex: 1, // Giúp slide chiếm toàn bộ không gian của swiper
    justifyContent: 'center',
    alignItems: 'center',
  },
});
