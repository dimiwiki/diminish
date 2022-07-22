const enum DocumentTypeIndex {
	document = 0,
	file = 1,
	category = 2,
	frame = 3,
	template = 4,
	user = 5,
	wiki = 6,
	commonTrash = 7,
	fileTrash = 8,
	management = 9
} // TODO: Create namespace access control in initalization

const enum DocumentTypePrefix {
	document = '문서',
	file = '파일',
	category = '카테고리',
	frame = '틀',
	template = '템플릿',
	user = '사용자',
	wiki = '디미위키',
	commonTrash = '휴지통',
	fileTrash = '파일휴지통',
	management = '위키운영'
}