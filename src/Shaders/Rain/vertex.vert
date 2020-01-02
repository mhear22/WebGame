uniform float age;

void main() {
	gl_PointSize = 2.0;

	vec3 i_position = position;
	
	float new_y = i_position.y - (15.0 * age);
	
	new_y = mod(new_y, 40.0) - 10.0;
	
	i_position.y = new_y;

	vec4 mvPosition = modelViewMatrix * vec4( i_position, 1.0 );
	gl_Position = projectionMatrix * mvPosition;
}