function generateMessage(from, text, type){
	return {
		from,
		text,
		createdAt: new Date().getTime(),
		type
	};
}

module.exports= {generateMessage};
