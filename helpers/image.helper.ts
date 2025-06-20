export const loadImage = (imageURL?: string) => {
	return `${process.env.NEXT_PUBLIC_API_SERVICE}${imageURL}`;
};
